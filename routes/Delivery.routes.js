const express = require("express");
const DeliveryRouter = new express.Router();
const {
  GetAllDeliveryPerCompany,
} = require("../controllers/Delivery.controller");

DeliveryRouter.get("/api/delivery", GetAllDeliveryPerCompany);

module.exports = DeliveryRouter;
