const express = require("express");
const AppointmentRouter = new express.Router();
const {
  GetAvailableBusinessForAppointment,
  AddAnAppointment,
  GetAllAppointmentPerCompany,
  GetAllValidAppointmentPerCompany,
  UpdateAppointmentStatus,
  GetAllAppointmentPerUser,
  AddUpdateApptConfig,
  GetCompanyApptConfig
} = require("../controllers/Appointment.controller");

AppointmentRouter.get("/api/available/business", GetAvailableBusinessForAppointment)

AppointmentRouter.post("/api/appointments/add", AddAnAppointment);

AppointmentRouter.get("/api/appointments", GetAllAppointmentPerCompany);

AppointmentRouter.put("/api/appointments/status/:id", UpdateAppointmentStatus);

AppointmentRouter.get("/api/users/appointments", GetAllAppointmentPerUser);

AppointmentRouter.get("/api/validate/appointment", GetAllValidAppointmentPerCompany);

AppointmentRouter.post("/api/appointment-config", AddUpdateApptConfig);

AppointmentRouter.get("/api/appointment-config/:company", GetCompanyApptConfig);

module.exports = AppointmentRouter;
