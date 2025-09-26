const mongoose = require("mongoose");

const VariantSchema = new mongoose.Schema({
  color: { type: String, required: true },
  images: [
    {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
  ],
});

const ProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, "Please provide a name for the product"],
    maxlength: [40, "Name can not be more than 40 characters"],
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
    default: 0,
  },
  company: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  variants: [VariantSchema], // ✅ new approach
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ProductModel = new mongoose.model("ProductInfo", ProductSchema);

module.exports = ProductModel;
