const UserModel = require("../models/UserModel");
const cipher = require("bcryptjs");
// const LoginHistoryModel = require("../models/LoginHistoryModel");

const AccountLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userEmail = await UserModel.findOne({
      email: email,
      acctStatus: "ACTIVE",
    });

    if (userEmail) {
      const isMatch = await cipher.compare(password, userEmail.password);
      if (!isMatch) {
        return res.status(401).json({ body: "Invalid Email or Password" });
        // validation for pending or disabled accounts
      } else {
        const token = await userEmail.generateAuthToken();

        res.cookie("UserCookie", token, {
          expire: new Date(Date.now + 604800000),
          httpOnly: true,
        });

        const result = {
          userEmail,
          token,
        };
        return res.status(201).json({ success: true, result });
      }
    } else {
      return res.status(401).json({ body: "Invalid Email or Password" });
    }
  } catch (error) {
    console.log(error);
  }
};

const AccountUserValidate = async (req, res) => {
  try {
    const validAccount = await UserModel.findOne({ _id: req.userId });
    return res.status(201).json({ body: validAccount });
  } catch (error) {
    return res.status(401).json({ body: "Unauthorized Access", status: 401 });
  }
};

const AddUser = async (req, res) => {
  const { name, email, contact, address, gender, password } = req.body;

  // Basic validation
  if (!name || !email || !contact || !address || !gender || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    const validate = await UserModel.findOne({ email });

    if (validate) {
      return res.status(422).json({ error: "Account Already Exists" });
    }

    const newUser = new UserModel({
      name: name.toUpperCase(),
      email,
      contact,
      userType: "USER",
      acctStatus: "ACTIVE",
      address: address.toUpperCase(),
      gender: gender.toUpperCase(),
      password
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      success: true,
      body: savedUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { AccountLogin, AccountUserValidate, AddUser };
