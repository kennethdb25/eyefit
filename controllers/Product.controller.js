const ProductModel = require("../models/ProductModel");
const cloudinary = require("../config/cloudinary/cloudinary");
const { v4: uuidv4 } = require("uuid");
const streamifier = require("streamifier");

const AddProduct = async (req, res) => {
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
  } = req.body;
  try {
    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "EYEFIT",
            public_id: `${uuidv4()}`,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve({
              public_id: result.public_id,
              url: result.secure_url,
            });
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    });

    const uploadedImages = await Promise.all(uploadPromises);

    const finalRecord = await new ProductModel({
      productName: productName,
      company: company,
      brand: brand,
      model: model,
      price: price,
      stocks: stocks,
      featured: featured,
      rating: rating,
      status: status,
      productImgURL: uploadedImages[0]?.url,
      productPublicId: uploadedImages[0]?.public_id,
    });

    const storeRecord = await finalRecord.save();

    res.status(200).json({ success: true, body: storeRecord });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

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
    } = req.body;

    const product = await ProductModel.findOne({ productPublicId: publicId });
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Helper to upload a single image to Cloudinary
    const uploadToCloudinary = (file) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "EYEFIT",
            public_id: uuidv4(),
          },
          (error, result) => {
            if (error) return reject(error);
            resolve({
              public_id: result.public_id,
              url: result.secure_url,
            });
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    };

    // If there are uploaded files, handle image replacement
    if (req.files && req.files.length > 0) {
      // Delete old image
      if (product.productPublicId) {
        await cloudinary.uploader.destroy(product.productPublicId);
      }

      // Upload new image(s)
      const uploadedImages = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file))
      );

      // Replace image fields with first uploaded image
      const { url, public_id } = uploadedImages[0];
      product.productImgURL = url;
      product.productPublicId = public_id;
    }

    // Always update shared product fields
    Object.assign(product, {
      productName,
      brand,
      model,
      company,
      price,
      stocks,
      featured,
      rating,
      status,
    });

    const updatedProduct = await product.save();
    res.status(200).json({ success: true, body: updatedProduct });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const GetAllProductByCompany = async (req, res) => {
  const company = req.query.company || "";
  try {
    const product = await ProductModel.find({ company });
    res.status(200).json({ success: true, body: product });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { AddProduct, EditProduct, GetAllProductByCompany };
