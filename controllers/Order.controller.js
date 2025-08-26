const UserModel = require("../models/UserModel");
const ProductModel = require("../models/ProductModel");
const OrderModel = require("../models/OrderModel");
const InventoryModel = require("../models/InventoryModel");
const DeliveryModel = require("../models/DeliverModel");
const NotificationModel = require("../models/NotificationModel");
const CheckOutModel = require("../models/CheckoutModel");

// const { BadRequest } = require("../utils/httpError");

const AddOrder = async (req, res) => {
  const { userId, products } = req.body;
  let previousCompany = null;

  try {
    // Check user
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let totalAmount = 0;
    const productUpdates = [];
    const validatedProducts = [];

    for (const item of products) {
      const { productId, quantity } = item;

      const product = await ProductModel.findById(productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product ${productId} not found` });
      }

      if (product.stocks < quantity) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for ${product.name}` });
      }

      if (previousCompany === null) {
        previousCompany = product.company;
      } else {
        if (product.company === previousCompany) {
          console.log("Same company");
        } else {
          console.log("Not the same company");
          return res.status(401).json({
            message:
              "Unauthorized Transaction. Please make sure that items are on the same company or establishments",
          });
        }
      }

      previousCompany = product.company;

      totalAmount += product.price * quantity;

      // Store for later use
      validatedProducts.push({ product, quantity });
    }

    // All validation passed — now deduct stocks and save
    for (const { product, quantity } of validatedProducts) {
      product.stocks -= quantity;
      productUpdates.push(product.save());
    }
    // Save updated stocks
    const inventoryProduct = await Promise.all(productUpdates);

    // Create order
    const newOrder = new OrderModel({
      user: userId,
      products: products.map((p) => ({
        product: p.productId,
        quantity: p.quantity,
      })),
      company: inventoryProduct[0].company || inventoryProduct.company,
      total: totalAmount,
    });

    const savedOrder = await newOrder.save();

    // if (inventoryProduct[0]?.company || inventoryProduct?.company) throw new Error("Company is required");

    if (savedOrder) {
      await NotificationModel.create({
        type: "New Order",
        orderId: savedOrder._id,
        userId,
        path: "order",
        company: inventoryProduct[0]?.company || inventoryProduct?.company,
        message: `Order #${savedOrder._id} placed by ${userId || "customer"}`
      });


      const newInventory = new InventoryModel({
        user: savedOrder.user,
        orderId: savedOrder._id,   // ✅ use the saved order’s id
        company: savedOrder.company,
        products: savedOrder.products,
        total: savedOrder.total,
      });


      await newInventory.save();
    }

    res.status(201).json({
      message: "Order placed successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const GetAllOrderPerCompany = async (req, res) => {
  try {
    const company = req.query.company || "";

    const allOrder = await OrderModel.find({ company })
      .populate("user") // optional: if you also want full user data
      .populate("products.product"); // <-- this populates product details

    return res.status(200).json({ success: true, body: allOrder });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

const UpdateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Only allow "Cancelled", "Processing", "Shipped" or "Completed"
  if (!["Cancelled", "Processing", "Shipped", "Completed"].includes(status)) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid status. Must be 'Cancelled', 'Processing', 'Shipped' or 'Completed'.",
    });
  }

  try {
    const updateOrder = await OrderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updateOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const updateInventoryStatus = await InventoryModel.findOne({ orderId: updateOrder._id });

    if (updateInventoryStatus) {
      const { _id } = updateInventoryStatus;

      await InventoryModel.findByIdAndUpdate(
        _id,
        { status },
        { new: true }
      );
    }

    if (status === "Shipped") {
      const { _id, company } = updateOrder;

      const newDelivery = new DeliveryModel({
        order: _id,
        company,
      });
      await newDelivery.save();
    }

    if (status === "Completed") {
      const { _id } = updateOrder;

      const deliveryRecord = await DeliveryModel.findOne({ order: _id });

      if (deliveryRecord) {
        await DeliveryModel.findOneAndUpdate(
          { order: _id }, // match by order reference
          { status },
          { new: true }
        );
      }
    }

    res.status(200).json({
      success: true,
      data: updateOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// USER API

const AddCheckOut = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    // check if user id and product are valid
    const validateUser = await UserModel.findById(userId);

    const validateProduct = await ProductModel.findById(productId);

    if (!validateProduct) {
      return res
        .status(404)
        .json({ message: `Product ${productId} not found` });
    }

    if (!validateUser) {
      return res
        .status(404)
        .json({ message: `User ${userId} not found` });
    }

    const finalCheckout = await new CheckOutModel({
      user: userId,
      product: productId,
    });

    const storeRecord = await finalCheckout.save();

    res.status(200).json({ success: true, body: storeRecord });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

const GetAllCheckoutPerUser = async (req, res) => {
  try {
    const userId = req.query.userId || "";

    if (!userId) {
      return res
        .status(404)
        .json({ message: `User ${userId} not found` });
    }

    const allCheckout = await CheckOutModel.find({ user: userId })
      .populate("user") // optional: if you also want full user data
      .populate("product"); // <-- this populates product details


    return res.status(200).json({ success: true, body: allCheckout });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
}

const RemoveCheckout = async (req, res) => {
  try {
    const id = req.query.checkoutId || "";

    const deleteOne = await CheckOutModel.findByIdAndDelete(id);

    if (deleteOne.deletedCount === 0) {
      return res.status(404).json({ message: "No records found for this user." });
    }

    return res.status(200).json({ success: true, message: `Deleted ${deleteOne.deletedCount} record.`, });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
}

const RemoveAllCheckoutPerUser = async (req, res) => {
  try {
    const userId = req.query.userId || "";

    const deleteAll = await CheckOutModel.deleteMany({ user: userId });

    if (deleteAll.deletedCount === 0) {
      return res.status(404).json({ message: "No records found for this user." });
    }

    return res.status(200).json({ success: true, message: `Deleted ${deleteAll.deletedCount} records for user ${userId}.`, });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
}

module.exports = { AddOrder, GetAllOrderPerCompany, UpdateOrderStatus, AddCheckOut, GetAllCheckoutPerUser, RemoveCheckout, RemoveAllCheckoutPerUser };
