const express = require("express");
const OrderRouter = new express.Router();
const {
  AddOrder,
  GetAllOrderPerCompany,
} = require("../controllers/Order.controller");

OrderRouter.post("/api/orders", AddOrder);

OrderRouter.get("/api/orders", GetAllOrderPerCompany);

module.exports = OrderRouter;
