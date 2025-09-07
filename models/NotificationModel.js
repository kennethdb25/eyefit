const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["New Order", "Shipped Order", "Completed Order"],
            required: true,
        },
        orderId: { type: String, required: true },
        userId: { type: String },
        path: { type: String },
        company: { type: String },
        status: { type: String },
        message: { type: String, required: true },
        companyRead: { type: Boolean, default: false },
        userRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const NotificationModel = new mongoose.model(
    "Notification",
    NotificationSchema
);

module.exports = NotificationModel;
