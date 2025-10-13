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
  const { userId, products, paymentMethod, paymentDetails } = req.body;
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
        return res.status(404).json({ message: `Product ${item.model} not found` });
      }

      if (product.stocks < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product?.model}` });
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
      paymentDetails: {
        paymentReferenceId: paymentDetails?.id || 'N/A',
        paymentType: paymentMethod === "otc" ? "Over the counter" : "card" ? "Debit/Credit Card" : "Cash on Delivery",
        amount: totalAmount
      },
      paymentMethod: paymentMethod === "otc" ? "Over the counter" : "card" ? "Debit/Credit Card" : "Cash on Delivery",
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
        message: `Order #${savedOrder._id} placed by ${user.email || "customer"}`,
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

// ---------------------------
// GET ALL ORDERS PER COMPANY
// ---------------------------
const GetAllOrderPerCompany = async (req, res) => {
  try {
    const company = req.query.company || "";
    const allOrder = await OrderModel.find({ company })
      .populate("user")
      .populate("products.product");
    return res.status(200).json({ success: true, body: allOrder });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

// ---------------------------
// UPDATE ORDER STATUS
// ---------------------------
const UpdateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["Cancelled", "Processing", "Shipped", "Completed"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status. Must be 'Cancelled', 'Processing', 'Shipped' or 'Completed'.",
    });
  }

  try {
    const updateOrder = await OrderModel.findByIdAndUpdate(id, { status }, { new: true });
    if (!updateOrder) return res.status(404).json({ success: false, message: "Order not found" });

    // update inventory status in one call
    await InventoryModel.findOneAndUpdate({ orderId: updateOrder._id }, { status });

    // handle notifications
    if (status === "Shipped") {
      await new DeliveryModel({ order: updateOrder._id, company: updateOrder.company }).save();
      await NotificationModel.create({
        type: "Shipped Order",
        orderId: updateOrder._id,
        userId: updateOrder.user,
        path: "order",
        company: updateOrder.company,
        message: `Order #${updateOrder._id} shipped by ${updateOrder.company || "shop"}`,
      });
    }

    if (status === "Completed") {
      await DeliveryModel.findOneAndUpdate({ order: updateOrder._id }, { status });
      await NotificationModel.create({
        type: "Completed Order",
        orderId: updateOrder._id,
        userId: updateOrder.user,
        path: "order",
        company: updateOrder.company,
        message: `Order #${updateOrder._id} delivered successfully`,
      });
    }

    if (status === "Cancelled") {
      await Promise.all(
        updateOrder?.products.map((p) =>
          ProductModel.findByIdAndUpdate(
            p?.product,
            { $inc: { stocks: p?.quantity } }, // increment stocks directly
            { new: true }
          )
        )
      );
    }
    // const updateOrder = await OrderModel.findByIdAndUpdate(id, { status }, { new: true });
    res.status(200).json({ success: true, data: updateOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

    const allCheckout = await CheckOutModel.find({ user: userId }).populate("user").populate("product");
    return res.status(200).json({ success: true, body: allCheckout });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

const RemoveCheckout = async (req, res) => {
  try {
    const id = req.query.checkoutId || "";
    const deleteOne = await CheckOutModel.findByIdAndDelete(id);

    if (!deleteOne) return res.status(404).json({ message: "No records found for this user." });

    return res.status(200).json({ success: true, message: "Checkout item deleted." });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

const RemoveAllCheckoutPerUser = async (req, res) => {
  try {
    const userId = req.query.userId || "";
    const deleteAll = await CheckOutModel.deleteMany({ user: userId });

    if (deleteAll.deletedCount === 0) {
      return res.status(404).json({ message: "No records found for this user." });
    }

    return res.status(200).json({
      success: true,
      message: `Deleted ${deleteAll.deletedCount} records for user ${userId}.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

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

    if (!updatedItem) return res.status(404).json({ message: "Checkout item not found" });
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const GetAllOrderPerUser = async (req, res) => {
  try {
    const id = req.query.userId || "";
    if (!id) {
      return res.status(404).json({ error: 'Not Found' });
    }
    const allOrder = await OrderModel.find({ user: id }).populate("user").populate("products.product");
    return res.status(200).json({ success: true, body: allOrder });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

const CreatePaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body; // amount in centavos

    const response = await fetch("https://api.paymongo.com/v1/payment_intents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " + Buffer.from("sk_test_WP1FKzGNZwVitiwi53116N7X:").toString("base64"),
      },
      body: JSON.stringify({
        data: {
          attributes: {
            amount,
            payment_method_allowed: ["card"],
            payment_method_options: { card: { request_three_d_secure: "any" } },
            currency: "PHP",
          },
        },
      }),
    });

    const data = await response.json();

    return res.status(200).json({ success: true, body: data });
  } catch (error) {
    console.error(error.response?.data || error.message);
    console.log(error)
    res.status(500).json({ error: "Payment intent creation failed" });
  }
}

const AddOrderReview = async (req, res) => {
  const { comment, rating, userId } = req.body;

  try {
    const order = await OrderModel.findByIdAndUpdate(
      req.params.id,
      { ratingStatus: true, comment, rating },
      { new: true }
    );

    if (!order || !userId) {
      return res.status(404).json({ error: "Something went wrong!" });
    }

    const product = await ProductModel.findById(order?.products[0]?.product);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const review = {
      user: userId,
      comment,
      rating,
    };

    product.reviews.push(review);

    product.averageRating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) /
      product.reviews.length;

    await product.save();

    // ✅ Send success response so frontend doesn't hang
    return res.status(201).json({
      message: "Review added successfully",
      product,
      order,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  AddOrder,
  GetAllOrderPerCompany,
  UpdateOrderStatus,
  AddCheckOut,
  GetAllCheckoutPerUser,
  RemoveCheckout,
  RemoveAllCheckoutPerUser,
  AddOrSubCheckoutQty,
  GetAllOrderPerUser,
  CreatePaymentIntent,
  AddOrderReview
};
