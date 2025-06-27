const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, "Please provide a customer name for the appointment"],
  },
  address: {
    type: String,
    required: [true, "Please provide your address for the appointment"],
  },
  gender: {
    type: String,
    required: [true, "Please provide your gender"],
  },
  age: {
    type: Number,
    required: [true, "Please provide your age for the appointment"],
  },
  order: {
    type: String,
    required: [true, "Please provide an order for the appointment"],
  },
  date: {
    type: Date,
    required: [true, "Please provide a date for the appointment"],
  },
  time: {
    type: String,
    required: [true, "Please provide a time for the appointment"],
  },
  isTimeSlotAvailable: {
    type: Boolean,
    required: true,
  },
  status: {
    type: String,
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  company: {
    type: String,
    required: true,
  },
});

const AppointmentModel = new mongoose.model(
  "AppointmentInfo",
  AppointmentSchema
);

module.exports = AppointmentModel;
