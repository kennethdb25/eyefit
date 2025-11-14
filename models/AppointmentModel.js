const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  customerFirstName: {
    type: String,
    required: [true, "Please provide a customer first name for the appointment"],
  },
  customerMiddleName: {
    type: String,
    required: [true, "Please provide a customer middle name for the appointment"],
  },
  customerLastName: {
    type: String,
    required: [true, "Please provide a customer last name for the appointment"],
  },
  address: {
    type: String,
    required: [true, "Please provide your address for the appointment"],
  },
  gender: {
    type: String,
    required: [true, "Please provide your gender"],
  },
  contact: {
    type: String,
    required: [true, "Please provide your contact"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
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
