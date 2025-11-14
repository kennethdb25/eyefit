const AccountModel = require("../models/AccountModel");
const AppointmentModel = require("../models/AppointmentModel");
const AppointmentConfigModel = require("../models/AppointmentConfigModel");

const GetAvailableBusinessForAppointment = async (req, res) => {
  try {
    // ✅ distinct is faster than aggregation for unique field values
    const companies = await AccountModel.aggregate([
      {
        '$match': {
          'userType': 'BUSINESS USER'
        }
      }, {
        '$group': {
          '_id': '$company'
        }
      }, {
        '$lookup': {
          'from': 'appointmentconfigs',
          'localField': '_id',
          'foreignField': 'company',
          'as': 'availableConfig'
        }
      }, {
        '$match': {
          'availableConfig': {
            '$ne': []
          }
        }
      }, {
        '$project': {
          'company': '$_id',
          '_id': 0
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      body: companies,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const AddAnAppointment = async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      address,
      gender,
      description,
      email,
      phone,
      date,
      time,
      store,
    } = req.body;

    const appointment = new AppointmentModel({
      customerFirstName: firstName.toUpperCase(),
      customerMiddleName: middleName.toUpperCase(),
      customerLastName: lastName.toUpperCase(),
      address: address.toUpperCase(),
      gender: gender.toUpperCase(),
      contact: `+63${phone}`,
      email,
      order: description ? description.toUpperCase() : "N.A",
      date,
      time,
      company: store,
    });

    const savedAppointment = await appointment.save();

    return res.status(201).json({
      success: true,
      data: savedAppointment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

const GetAllAppointmentPerCompany = async (req, res) => {
  try {
    const company = req.query.company || "";

    const allAppointments = await AppointmentModel.find({ company })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ success: true, body: allAppointments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const GetAllValidAppointmentPerCompany = async (req, res) => {
  try {
    const company = req.query.company || "";

    const allValidAppointments = await AppointmentModel.find({
      company,
      status: { $nin: ["Cancelled", "Rejected"] },
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ success: true, body: allValidAppointments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const UpdateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["Accepted", "Rejected", "Cancelled"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status. Must be 'Accepted', 'Rejected', or 'Cancelled'.",
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

    return res.status(200).json({
      success: true,
      data: updatedAppointment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const GetAllAppointmentPerUser = async (req, res) => {
  try {
    const email = req.query.email || "";

    const allAppointments = await AppointmentModel.find({ email })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ success: true, body: allAppointments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const AddUpdateApptConfig = async (req, res) => {
  try {
    const { company, workingDays, workingHours, exceptions } = req.body;

    const config = await AppointmentConfigModel.findOneAndUpdate(
      { company },
      { workingDays, workingHours, exceptions },
      { new: true, upsert: true }
    );

    return res.status(200).json({ success: true, body: config });
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, error: err.message });
  }
}

const GetCompanyApptConfig = async (req, res) => {
  try {
    const config = await AppointmentConfigModel.findOne({ company: req?.params?.company });
    return res.status(200).json({ success: true, body: config });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  GetAvailableBusinessForAppointment,
  AddAnAppointment,
  GetAllAppointmentPerCompany,
  GetAllValidAppointmentPerCompany,
  UpdateAppointmentStatus,
  GetAllAppointmentPerUser,
  AddUpdateApptConfig,
  GetCompanyApptConfig
};
