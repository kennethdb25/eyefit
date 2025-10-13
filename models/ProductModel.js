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

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // assuming you have a User model
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
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
  arId: {
    type: String,
    required: true
  },
  recommended: {
    type: [String],
    required: true,
  },
  reviews: [reviewSchema],
  averageRating: {
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
