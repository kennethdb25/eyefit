const express = require("express");
const OrderRouter = new express.Router();
const {
  AddOrder,
  GetAllOrderPerCompany,
  UpdateOrderStatus,
} = require("../controllers/Order.controller");

OrderRouter.post("/api/orders", AddOrder);

OrderRouter.get("/api/orders", GetAllOrderPerCompany);

OrderRouter.put("/api/orders/:id/status", UpdateOrderStatus);

module.exports = OrderRouter;
