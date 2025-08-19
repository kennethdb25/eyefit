const express = require("express");
const InventoryRouter = new express.Router();
const {
    GetInventoryPerCompany,
} = require("../controllers/Inventory.controller");

InventoryRouter.get("/api/inventory", GetInventoryPerCompany);

module.exports = InventoryRouter;
