const express = require("express");
const AppointmentRouter = new express.Router();
const {
  AddAnAppointment,
  GetAllAppointmentPerCompany,
  UpdateAppointmentStatus,
} = require("../controllers/Appointment.controller");

AppointmentRouter.post("/api/appointments/add", AddAnAppointment);
AppointmentRouter.get("/api/appointments", GetAllAppointmentPerCompany);
AppointmentRouter.put("/api/appointments/status/:id", UpdateAppointmentStatus);

module.exports = AppointmentRouter;
