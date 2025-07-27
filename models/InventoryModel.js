const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductInfo",
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  change: {
    type: Number, // positive for restock, negative for deduction
    required: true,
  },
  reason: {
    type: String,
    enum: ["order", "restock", "adjustment", "return"],
    required: true,
  },
  relatedOrder: {
    type: String,
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // optional: tracks the admin/user who made the change
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const InventoryModel = new mongoose.model("InventoryrInfo", InventorySchema);

module.exports = InventoryModel;
