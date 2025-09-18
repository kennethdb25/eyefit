const mongoose = require("mongoose");
const UserModel = require("../models/UserModel");
const ProductModel = require("../models/ProductModel");
const OrderModel = require("../models/OrderModel");
const InventoryModel = require("../models/InventoryModel");
const DeliveryModel = require("../models/DeliverModel");
const NotificationModel = require("../models/NotificationModel");
const CheckOutModel = require("../models/CheckoutModel");

// ---------------------------
// ADD ORDER
// ---------------------------
const AddOrder = async (req, res) => {
  const { userId, products, paymentMethod } = req.body;

  try {
    // ✅ validate user in one call
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ fetch all products in one query
    const productIds = products.map((p) => p.productId);
    const foundProducts = await ProductModel.find({ _id: { $in: productIds } });

    if (foundProducts.length !== productIds.length) {
      return res.status(404).json({ message: "One or more products not found" });
    }

    let totalAmount = 0;
    let previousCompany = null;

    // validate + compute totals
    for (const item of products) {
      const product = foundProducts.find((p) => p._id.toString() === item.productId);

      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      if (product.stocks < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product?.brand}` });
      }

      if (!previousCompany) {
        previousCompany = product.company;
      } else if (product.company.toString() !== previousCompany.toString()) {
        return res.status(401).json({
          message: "Unauthorized Transaction. Items must be from the same company",
        });
      }

      totalAmount += product.price * item.quantity;
    }

    // ✅ bulk stock updates
    const bulkOps = products.map((item) => ({
      updateOne: {
        filter: { _id: item.productId },
        update: { $inc: { stocks: -item.quantity } },
      },
    }));
    await ProductModel.bulkWrite(bulkOps);

    // ✅ update status to "Out of Stock" if stocks = 0
    const updatedProducts = await ProductModel.find({ _id: { $in: productIds } });

    const statusOps = updatedProducts
      .filter((p) => p.stocks <= 0) // products that ran out of stock
      .map((p) => ({
        updateOne: {
          filter: { _id: p._id },
          update: { $set: { status: "Out of Stock" } },
        },
      }));

    if (statusOps.length > 0) {
      await ProductModel.bulkWrite(statusOps);
    }

    // create order
    const newOrder = new OrderModel({
      user: userId,
      products: products.map((p) => ({
        product: p.productId,
        quantity: p.quantity,
        color: p.color,
      })),
      paymentMethod: paymentMethod === "otc" ? "Over the counter" : "Cash on Delivery",
      company: previousCompany,
      total: totalAmount,
    });

    const savedOrder = await newOrder.save();

    if (savedOrder) {
      // notify company
      await NotificationModel.create({
        type: "New Order",
        orderId: savedOrder._id,
        userId,
        path: "order",
        company: previousCompany,
        message: `Order #${savedOrder._id} placed by ${userId || "customer"}`,
      });

      // inventory log
      await new InventoryModel({
        user: savedOrder.user,
        orderId: savedOrder._id,
        company: savedOrder.company,
        products: savedOrder.products,
        total: savedOrder.total,
      }).save();
    }

    res.status(201).json({ success: true, order: savedOrder });
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

      await NotificationModel.create({
        type: "Shipped Order",
        orderId: _id,
        userId: updateOrder?.user,
        path: "order",
        company: company,
        message: `Order #${updateOrder._id} ship by ${company || "shop"}`
      });
    }

    if (status === "Completed") {
      const { _id, company } = updateOrder;

      const deliveryRecord = await DeliveryModel.findOne({ order: _id });

      if (deliveryRecord) {
        await DeliveryModel.findOneAndUpdate(
          { order: _id }, // match by order reference
          { status },
          { new: true }
        );



        await NotificationModel.create({
          type: "Completed Order",
          orderId: _id,
          userId: updateOrder?.user,
          path: "order",
          company: company,
          message: `Order #${updateOrder._id} delivered successfully`
        });
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

// ---------------------------
// CHECKOUT APIs (kept same)
// ---------------------------
const AddCheckOut = async (req, res) => {
  const { userId, productId, color, quantity = 1 } = req.body;

  try {
    // validate user & product
    const [validateUser, validateProduct] = await Promise.all([
      UserModel.findById(userId),
      ProductModel.findById(productId),
    ]);

    if (!validateProduct) return res.status(404).json({ message: `Product ${productId} not found` });
    if (!validateUser) return res.status(404).json({ message: `User ${userId} not found` });

    // ✅ single DB call with upsert
    const checkoutItem = await CheckOutModel.findOneAndUpdate(
      { user: userId, product: productId, color },         // match
      { $inc: { quantity } },                              // increase quantity
      { new: true, upsert: true, setDefaultsOnInsert: true } // if not exist → create
    );

    res.status(200).json({ success: true, body: checkoutItem });
  } catch (error) {
    console.error("AddCheckOut Error:", error);
    res.status(400).json({ error: error.message });
  }
};

const GetAllCheckoutPerUser = async (req, res) => {
  try {
    const userId = req.query.userId || "";

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid or missing userId" });
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

const AddOrSubCheckoutQty = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const updatedItem = await CheckOutModel.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Checkout item not found" });
    }

    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


const GetAllOrderPerUser = async (req, res) => {
  try {
    const id = req.query.userId || "";

    const allOrder = await OrderModel.find({ user: id })
      .populate("user") // optional: if you also want full user data
      .populate("products.product"); // <-- this populates product details

    return res.status(200).json({ success: true, body: allOrder });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

module.exports = { AddOrder, GetAllOrderPerCompany, UpdateOrderStatus, AddCheckOut, GetAllCheckoutPerUser, RemoveCheckout, RemoveAllCheckoutPerUser, AddOrSubCheckoutQty, GetAllOrderPerUser };
