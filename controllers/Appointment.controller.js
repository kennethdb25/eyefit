const AppointmentModel = require("../models/AppointmentModel");

const AddAnAppointment = async (req, res) => {
  try {
    const { customerName, address, gender, age, order, date, time, company } =
      req.body;

    const appointment = new AppointmentModel({
      customerName,
      address,
      gender,
      age,
      order,
      date,
      time,
      company,
    });

    const savedAppointment = await appointment.save();

    res.status(201).json({
      success: true,
      data: savedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

const GetAllAppointmentPerCompany = async (req, res) => {
  try {
    const company = req.query.company || "";

    const allAppointments = await AppointmentModel.find({ company });

    return res.status(200).json({ success: true, body: allAppointments });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

const UpdateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Only allow "Accepted" or "Rejected"
  if (!["Accepted", "Rejected"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status. Must be 'Accepted' or 'Rejected'.",
    });
  }

  try {
    const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  AddAnAppointment,
  GetAllAppointmentPerCompany,
  UpdateAppointmentStatus,
};
