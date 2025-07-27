const UserModel = require("../models/UserModel");

const AddUser = async (req, res) => {
  const { name, email, contact, address, gender } = req.body;

  // Basic validation
  if (!name || !email || !contact || !address || !gender) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newUser = new UserModel({
      name,
      email,
      contact,
      address,
      gender,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: savedUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { AddUser };
