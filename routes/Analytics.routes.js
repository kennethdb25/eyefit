const express = require("express");
const AnalyticsRouter = new express.Router();
const { SalesAnalytics, TopProducts, CardAnalytics } = require("../controllers/Analytics.controller");

AnalyticsRouter.get("/api/analytics/order", SalesAnalytics);

AnalyticsRouter.get("/api/analytics/top-products", TopProducts);

AnalyticsRouter.get("/api/analytics/summary", CardAnalytics);

module.exports = AnalyticsRouter;