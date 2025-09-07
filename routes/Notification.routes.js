const express = require("express");
const NotificationRouter = new express.Router();
const {
    GetNotificationPerCompany,
    MarkAllNotificationsAsReadPerCompany,
    MarkAsReadNotification,
    GetNotificationPerUser,
    MarkAsReadNotificationPerUser
} = require("../controllers/Notification.controller");

NotificationRouter.get("/api/notification", GetNotificationPerCompany);

NotificationRouter.put("/api/notification/mark-as-read", MarkAllNotificationsAsReadPerCompany);

NotificationRouter.put("/api/notification/unread", MarkAsReadNotification);

NotificationRouter.get("/api/user/notification", GetNotificationPerUser);

NotificationRouter.put("/api/user/notification", MarkAsReadNotificationPerUser);

module.exports = NotificationRouter;
