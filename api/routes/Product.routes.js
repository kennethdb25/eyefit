const express = require("express");
const ProductRouter = new express.Router();
const multer = require("multer");
const {
  AddProduct,
  EditProduct,
  GetAllProductByCompany,
  GetAvailableProduct
} = require("../controllers/Product.controller");

const storage = multer.memoryStorage();
const upload = multer({ storage });

ProductRouter.post("/api/product/add", upload.array("images", 10), AddProduct);
ProductRouter.put("/api/product/edit", upload.array("images", 10), EditProduct);
ProductRouter.get("/api/product", GetAllProductByCompany);

// USER API
ProductRouter.get("/api/user/product", GetAvailableProduct);

module.exports = ProductRouter;
