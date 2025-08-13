const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OrderInfo",
    required: true,
  },
  status: {
    type: String,
    enum: ["Shipped", "Delivered"],
    default: "Shipped",
  },
  company: {
    type: String,
    required: true,
  },
  shippedOutDate: {
    type: Date,
    default: Date.now,
  },
});

const DeliveryModel = new mongoose.model("DeliverInfo", DeliverySchema);

module.exports = DeliveryModel;
