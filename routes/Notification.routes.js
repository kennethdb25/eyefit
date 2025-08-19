const express = require("express");
const NotificationRouter = new express.Router();
const {
    GetNotificationPerCompany,
    MarkAllNotificationsAsReadPerCompany,
    MarkAsReadNotification
} = require("../controllers/Notification.controller");

NotificationRouter.get("/api/notification", GetNotificationPerCompany);

NotificationRouter.put("/api/notification/mark-as-read", MarkAllNotificationsAsReadPerCompany);

NotificationRouter.put("/api/notification/", MarkAsReadNotification);

module.exports = NotificationRouter;
