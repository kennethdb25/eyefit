const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, "Please provide a name for the product"],
    maxlength: [40, "Name can not be more than 40 characters"],
  },
  productImgURL: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: [true, "Please provide a brand for the product"],
    maxlength: [40, "Brand can not be more than 40 characters"],
  },
  model: {
    type: String,
    required: [true, "Please provide a model for the product"],
    maxlength: [40, "Model can not be more than 40 characters"],
  },
  price: {
    type: Number,
    required: [true, "Please provide a price for the product"],
  },
  stocksLeft: {
    type: Number,
    required: true,
  },
  sold: {
    type: Number,
    default: 0,
  },
  company: {
    type: String,
    required: true,
  },
});

const InventoryModel = new mongoose.model("InventoryrInfo", InventorySchema);

module.exports = InventoryModel;
