const mongoose = require("mongoose");

const AppointmentConfigSchema = new mongoose.Schema({
    company: {
        type: String, // "HH:mm"
        required: true,
    },
    workingDays: {
        type: [Number], // 0 = Sunday, 6 = Saturday
        validate: {
            validator: (days) => days.every((d) => d >= 0 && d <= 6),
            message: "Working days must be between 0 (Sunday) and 6 (Saturday).",
        },
        required: true,
    },
    workingHours: {
        start: {
            type: String, // "HH:mm"
            required: true,
        },
        end: {
            type: String, // "HH:mm"
            required: true,
        },
    },
    exceptions: [
        {
            type: String, // "YYYY-MM-DD"
            required: true,
        },
    ],
}, { timestamps: true });

const AppointmentConfigModel = new mongoose.model("AppointmentConfig", AppointmentConfigSchema);

module.exports = AppointmentConfigModel;