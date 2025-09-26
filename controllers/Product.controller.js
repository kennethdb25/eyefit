const ProductModel = require("../models/ProductModel");
const cloudinary = require("../config/cloudinary/cloudinary");
const { v4: uuidv4 } = require("uuid");
const streamifier = require("streamifier");

// 🔹 Reusable Cloudinary upload helper
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "EYEFIT", public_id: uuidv4() },
      (error, result) => {
        if (error) return reject(error);
        resolve({ publicId: result.public_id, url: result.secure_url });
      }
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

const AddProduct = async (req, res) => {
  try {
    const {
      productName,
      brand,
      model,
      company,
      price,
      stocks,
      featured,
      variants, // JSON string from frontend
    } = req.body;

    const parsedVariants = variants ? JSON.parse(variants) : [];

    // group uploaded files by variant index
    const filesByVariant = {};
    (req.files || []).forEach((file) => {
      const match = file.fieldname.match(/variants\[(\d+)\]\[images\]/);
      if (match) {
        const index = match[1];
        filesByVariant[index] = file; // only allow one image per variant
      }
    });

    // upload each file and merge with variant
    const finalVariants = await Promise.all(
      parsedVariants.map(async (variant, index) => {
        const file = filesByVariant[index];
        let uploadedImage = null;

        if (file) {
          uploadedImage = await uploadToCloudinary(file);
        }

        return {
          color: variant.color,
          images: uploadedImage ? [uploadedImage] : [], // enforce array with max 1
        };
      })
    );

    const newProduct = await ProductModel.create({
      productName,
      company,
      brand,
      model,
      price,
      stocks,
      featured,
      rating: 0,
      status: stocks > 0 ? "In Stock" : "Out of Stock",
      variants: finalVariants,
    });

    res.status(200).json({ success: true, body: newProduct });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};


// 🔹 Edit Product
const EditProduct = async (req, res) => {
  try {
    const publicId = req.query.publicId || "";
    const {
      productName,
      brand,
      model,
      company,
      price,
      stocks,
      featured,
      rating,
      status,
      variants, // JSON string from frontend
    } = req.body;

    const parsedVariants = variants ? JSON.parse(variants) : [];

    const product = await ProductModel.findOne({ _id: publicId });
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    // group uploaded files by variant index
    const filesByVariant = {};
    (req.files || []).forEach((file) => {
      const match = file.fieldname.match(/variants\[(\d+)\]\[images\]/);
      if (match) {
        const index = match[1];
        filesByVariant[index] = file; // one file per variant
      }
    });

    // build updated variants
    const updatedVariants = await Promise.all(
      parsedVariants.map(async (variant, index) => {
        const file = filesByVariant[index];
        let newImage = null;

        if (file) {
          // destroy old Cloudinary image if exists
          const oldImage = product.variants?.[index]?.images?.[0];
          if (oldImage?.publicId) {
            await cloudinary.uploader.destroy(oldImage.publicId);
          }

          // upload new image
          newImage = await uploadToCloudinary(file);
        }

        return {
          color: variant.color,
          images: newImage
            ? [newImage] // overwrite with new image
            : product.variants?.[index]?.images || [], // keep old image if no new one
        };
      })
    );

    Object.assign(product, {
      productName,
      brand,
      model,
      company,
      price,
      stocks,
      featured,
      rating,
      status: stocks > 0 ? "In Stock" : status,
      variants: updatedVariants,
    });

    const updatedProduct = await product.save();
    res.status(200).json({ success: true, body: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};


// 🔹 Get Products by Company
const GetAllProductByCompany = async (req, res) => {
  try {
    const company = req.query.company || "";
    const products = await ProductModel.find({ company });
    res.status(200).json({ success: true, body: products });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 🔹 Get Available Products (not discontinued)
const GetAvailableProduct = async (req, res) => {
  try {
    const products = await ProductModel.find({
      status: { $nin: ["Discontinued"] },
    });
    res.status(200).json({ success: true, body: products });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 🔹 Search Products (available only)
const SearchAvailableProduct = async (req, res) => {
  try {
    const query = req.query.q || "";
    const filters = query
      ? {
        $or: [
          { productName: { $regex: query, $options: "i" } },
          { brand: { $regex: query, $options: "i" } },
          { model: { $regex: query, $options: "i" } },
          { company: { $regex: query, $options: "i" } },
        ],
        status: { $nin: ["Discontinued"] },
      }
      : { status: { $nin: ["Discontinued"] } };

    const products = await ProductModel.find(filters);
    res.status(200).json({ success: true, body: products });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  AddProduct,
  EditProduct,
  GetAllProductByCompany,
  GetAvailableProduct,
  SearchAvailableProduct,
};
