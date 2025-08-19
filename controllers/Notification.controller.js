const NotificationModel = require('../models/NotificationModel');

const GetNotificationPerCompany = async (req, res) => {
    try {
        const company = req.query.company || "";

        const notifs = await NotificationModel.find({ company }).sort({ createdAt: -1 }) || [];

        return res.status(200).json({ success: true, body: notifs });
    } catch (error) {
        console.log(error);
        return res.status(404).json(error);
    }
}


const MarkAllNotificationsAsReadPerCompany = async (req, res) => {
    try {
        const company = req.query.company || "";

        const notifs = await NotificationModel.updateMany(
            { company, read: false },    // filter: unread + specific company
            { $set: { read: true } }     // update
        );

        return res.status(200).json({ success: true, body: notifs });
    } catch (error) {
        console.log(error);
        return res.status(404).json(error);
    }
}

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
            { read: true },
            { new: true }
        )

        if (!notificationMarkAsRead) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }

        res.status(200).json({
            success: true,
            data: notificationMarkAsRead,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports = { GetNotificationPerCompany, MarkAllNotificationsAsReadPerCompany, MarkAsReadNotification };