const express = require("express");
const AppointmentRouter = new express.Router();
const {
  GetAvailableBusinessForAppointment,
  AddAnAppointment,
  GetAllAppointmentPerCompany,
  UpdateAppointmentStatus,
  GetAllAppointmentPerUser
} = require("../controllers/Appointment.controller");

AppointmentRouter.get("/api/available/business", GetAvailableBusinessForAppointment)

AppointmentRouter.post("/api/appointments/add", AddAnAppointment);

AppointmentRouter.get("/api/appointments", GetAllAppointmentPerCompany);

AppointmentRouter.put("/api/appointments/status/:id", UpdateAppointmentStatus);

AppointmentRouter.get("/api/users/appointments", GetAllAppointmentPerUser);

module.exports = AppointmentRouter;
