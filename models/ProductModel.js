const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, "Please provide a name for the product"],
    maxlength: [40, "Name can not be more than 40 characters"],
  },
  // change product imageURL and publicId to array of Object that will accept multiple object details for images
  productImgURL: {
    type: String,
    required: true,
  },
  productPublicId: {
    type: String,
    required: true,
  },
  colors: {
    type: Array,
    required: true
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
  stocks: {
    type: Number,
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  company: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

const ProductModel = new mongoose.model("ProductInfo", ProductSchema);

module.exports = ProductModel;
