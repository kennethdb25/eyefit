const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductInfo",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      color: {
        type: String,
        required: true
      },
    },
  ],
  ratingStatus: {
    type: Boolean,
    default: false
  },
  comment: {
    type: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  total: {
    type: Number,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentDetails: {
    paymentReferenceId: {
      type: String
    },
    paymentType: {
      type: String
    },
    amount: {
      type: Number
    }
  },
  status: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const OrderModel = new mongoose.model("OrderInfo", OrderSchema);

module.exports = OrderModel;
