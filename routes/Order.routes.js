const express = require("express");
const OrderRouter = new express.Router();
const {
  AddOrder,
  GetAllOrderPerCompany,
  UpdateOrderStatus,
  AddCheckOut,
  GetAllCheckoutPerUser, RemoveCheckout, RemoveAllCheckoutPerUser
} = require("../controllers/Order.controller");

OrderRouter.post("/api/orders", AddOrder);

OrderRouter.get("/api/orders", GetAllOrderPerCompany);

OrderRouter.put("/api/orders/status/:id", UpdateOrderStatus);

// USER API
OrderRouter.post("/api/user/checkout", AddCheckOut);

OrderRouter.get("/api/user/get-checkout", GetAllCheckoutPerUser);

OrderRouter.delete("/api/user/remove/checkout", RemoveCheckout)

OrderRouter.delete("/api/user/remove/all/checkout", RemoveAllCheckoutPerUser)

module.exports = OrderRouter;
