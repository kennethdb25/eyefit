const AccountModel = require("../models/AccountModel");
const cipher = require("bcryptjs");

const AccountLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userEmail = await AccountModel.findOne({
      email,
      acctStatus: "ACTIVE",
    });

    if (!userEmail) {
      return res.status(401).json({ body: "Invalid Email or Password" });
    }

    const isMatch = await cipher.compare(password, userEmail.password);
    if (!isMatch) {
      return res.status(401).json({ body: "Invalid Email or Password" });
    }

    const token = await userEmail.generateAuthToken();

    res.cookie("UserCookie", token, {
      expire: new Date(Date.now() + 604800000), // 7 days
      httpOnly: true,
    });

    return res.status(201).json({
      success: true,
      result: { userEmail, token },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ body: "Something went wrong" });
  }
};

const AccountLogout = async (req, res) => {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter(
      (currElem) => currElem != req.token
    );
    await req.rootUser.save();

    res.clearCookie("UserCookie", { path: "/" });
    return res.status(201).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ body: "Something went wrong" });
  }
};

const AccountValidate = async (req, res) => {
  try {
    const validAccount = await AccountModel.findById(req.userId).lean();
    if (!validAccount) {
      return res.status(401).json({ body: "Unauthorized Access", status: 401 });
    }
    return res.status(201).json({ body: validAccount });
  } catch (error) {
    return res.status(401).json({ body: "Unauthorized Access", status: 401 });
  }
};

const AccountSignup = async (req, res) => {
  const {
    firstName,
    middleName,
    lastName,
    contact,
    company,
    address,
    userType,
    email,
    password,
  } = req.body;

  try {
    // Check for duplicates in ONE query
    const existing = await AccountModel.findOne({
      $or: [{ email }, userType !== "ADMIN USER" ? { company } : null].filter(
        Boolean
      ),
    });

    if (existing) {
      return res.status(422).json({ error: "Account Already Exists" });
    }

    const userDetails = new AccountModel({
      firstName: firstName.toUpperCase(),
      middleName: middleName.toUpperCase(),
      lastName: lastName.toUpperCase(),
      address: address.toUpperCase(),
      company: company ? company.toUpperCase() : "ADMIN USER",
      contact,
      userType: userType || "USER",
      password,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      acctStatus: "ACTIVE",
      email,
    });

    const data = await userDetails.save();
    return res.status(200).json({ success: true, body: data });
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
};

const GetAllAccountUser = async (req, res) => {
  try {
    const allAccountUser = await AccountModel.find().lean();
    return res.status(200).json({ success: true, body: allAccountUser });
  } catch (error) {
    return res.status(404).json(error);
  }
};

const EditAccount = async (req, res) => {
  try {
    const id = req.query.userId || "";
    const updateFields = req.body;

    const updateAccount = await AccountModel.findByIdAndUpdate(
      id,
      { ...updateFields, modified: new Date().toISOString() },
      { new: true }
    );

    if (!updateAccount) {
      return res.status(404).json({ error: "User Account not found." });
    }

    return res.status(200).json({ success: true, body: updateAccount });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};

const AccountLoginHistory = async (req, res) => { };

module.exports = {
  AccountSignup,
  AccountLogin,
  AccountValidate,
  AccountLogout,
  GetAllAccountUser,
  EditAccount,
};
