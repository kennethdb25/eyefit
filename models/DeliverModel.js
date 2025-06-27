const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered"],
    default: "pending",
  },
  zip: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OrderInfo",
  },
});

const DeliveryModel = new mongoose.model("DeliverInfo", DeliverySchema);

module.exports = DeliveryModel;
