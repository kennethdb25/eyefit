const express = require("express");
const ProductRouter = new express.Router();
const multer = require("multer");
const {
  AddProduct,
  EditProduct,
  GetAllProductByCompany,
  GetAvailableProduct,
  SearchAvailableProduct
} = require("../controllers/Product.controller");

const storage = multer.memoryStorage();
const upload = multer({ storage });

ProductRouter.post("/api/product/add", upload.any(), AddProduct);
ProductRouter.put("/api/product/edit", upload.any(), EditProduct);
ProductRouter.get("/api/product", GetAllProductByCompany);
ProductRouter.get("/api/product/search", SearchAvailableProduct);

// USER API
ProductRouter.get("/api/user/product", GetAvailableProduct);

module.exports = ProductRouter;
