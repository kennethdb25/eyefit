const AccountModel = require("../models/AccountModel");
const AppointmentModel = require("../models/AppointmentModel");

const GetAvailableBusinessForAppointment = async (req, res) => {
  try {
    const AvailableBusiness = await AccountModel.aggregate([
      {
        '$match': {
          'userType': 'BUSINESS USER'
        }
      }, {
        '$group': {
          '_id': '$company'
        }
      }, {
        '$project': {
          '_id': 0,
          'company': '$_id'
        }
      }
    ]);

    return res.status(200).json({ success: true, body: AvailableBusiness });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

const AddAnAppointment = async (req, res) => {
  try {
    const { name, address, gender, description, email, phone, date, time, store } =
      req.body;

    const appointment = new AppointmentModel({
      customerName: name,
      address,
      contact: phone,
      email,
      gender,
      order: description ? description.toUpperCase() : "N.A",
      date,
      time,
      company: store,
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


const GetAllValidAppointmentPerCompany = async (req, res) => {
  try {
    const company = req.query.company || "";

    const allValidAppointments = await AppointmentModel.find({ company, status: { $nin: ['Cancelled', 'Rejected'] } });

    return res.status(200).json({ success: true, body: allValidAppointments });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

const UpdateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Only allow "Accepted" or "Rejected"
  if (!["Accepted", "Rejected", "Cancelled"].includes(status)) {
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


const GetAllAppointmentPerUser = async (req, res) => {
  try {
    const email = req.query.email || "";

    const allAppointments = await AppointmentModel.find({ email }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, body: allAppointments });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

module.exports = {
  GetAvailableBusinessForAppointment,
  AddAnAppointment,
  GetAllAppointmentPerCompany,
  GetAllValidAppointmentPerCompany,
  UpdateAppointmentStatus,
  GetAllAppointmentPerUser
};
