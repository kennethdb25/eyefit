const NotificationModel = require('../models/NotificationModel');

const GetNotificationPerCompany = async (req, res) => {
    try {
        const company = req.query.company || "";
        const limit = 10;

        const notifs = await NotificationModel.find({ company, type: "New Order" })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean(); // ✅ faster, plain objects

        return res.status(200).json({ success: true, body: notifs || [] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

const MarkAllNotificationsAsReadPerCompany = async (req, res) => {
    try {
        const company = req.query.company || "";

        const notifs = await NotificationModel.updateMany(
            { company, read: false },
            { $set: { read: true } }
        );

        return res.status(200).json({ success: true, body: notifs });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

const MarkAsReadNotification = async (req, res) => {
    const id = req.query.notificationId || "";

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Notification Id is required",
        });
    }

    try {
        const notificationMarkAsRead = await NotificationModel.findByIdAndUpdate(
            id,
            { companyRead: true },
            { new: true }
        ).lean();

        if (!notificationMarkAsRead) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: notificationMarkAsRead,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const GetNotificationPerUser = async (req, res) => {
    try {
        const id = req.query.userId || "";
        const limit = 20;

        const notifs = await NotificationModel.find({ userId: id })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        return res.status(200).json({ success: true, body: notifs || [] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

const MarkAsReadNotificationPerUser = async (req, res) => {
    const id = req.query.notificationId || "";

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Notification Id is required",
        });
    }

    try {
        const notificationMarkAsRead = await NotificationModel.findByIdAndUpdate(
            id,
            { userRead: true },
            { new: true }
        ).lean();

        if (!notificationMarkAsRead) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: notificationMarkAsRead,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    GetNotificationPerCompany,
    MarkAllNotificationsAsReadPerCompany,
    MarkAsReadNotification,
    GetNotificationPerUser,
    MarkAsReadNotificationPerUser,
};
