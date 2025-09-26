const mongoose = require("mongoose");
const LikeModel = require("../models/LikeModel");
const ProductModel = require("../models/ProductModel");
const UserModel = require("../models/UserModel");
const cipher = require("bcryptjs");
const ViewModel = require("../models/ViewModel");

// ---------------------- ACCOUNT ----------------------

const AccountLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userEmail = await UserModel.findOne({ email, acctStatus: "ACTIVE" });

    if (!userEmail) {
      return res.status(401).json({ body: "Invalid Email or Password" });
    }

    const isMatch = await cipher.compare(password, userEmail.password);
    if (!isMatch) {
      return res.status(401).json({ body: "Invalid Email or Password" });
    }

    const token = await userEmail.generateAuthToken();
    res.cookie("UsersCookie", token, {
      expire: new Date(Date.now() + 604800000), // 7 days
      httpOnly: true,
    });

    return res.status(201).json({ success: true, result: { userEmail, token } });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const AccountUserValidate = async (req, res) => {
  try {
    const validAccount = await UserModel.findById(req.userId).lean();
    return res.status(201).json({ body: validAccount });
  } catch {
    return res.status(401).json({ body: "Unauthorized Access", status: 401 });
  }
};

const AccountUserLogout = async (req, res) => {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter(
      (currElem) => currElem !== req.token
    );
    res.clearCookie("UsersCookie", { path: "/" });

    await req.rootUser.save();
    return res.status(201).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const AddUser = async (req, res) => {
  const { name, email, contact, address, gender, password } = req.body;

  if (!name || !email || !contact || !address || !gender || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existing = await UserModel.findOne({ email }).lean();
    if (existing) {
      return res.status(422).json({ error: "Account Already Exists" });
    }

    const savedUser = await UserModel.create({
      name: name.toUpperCase(),
      email,
      contact: `+63${contact}`,
      userType: "USER",
      acctStatus: "ACTIVE",
      address: address.toUpperCase(),
      gender: gender.toUpperCase(),
      password,
    });

    res.status(201).json({ success: true, body: savedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const UpdateUserAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { address },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(201).json({ success: true, body: user });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------- PRODUCT LIKES ----------------------

const LikeProduct = async (req, res) => {
  const { userId, productId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid IDs" });
  }

  try {
    const [validateUser, validateProduct] = await Promise.all([
      UserModel.findById(userId).lean(),
      ProductModel.findById(productId).lean(),
    ]);

    if (!validateUser) return res.status(404).json({ message: `User ${userId} not found` });
    if (!validateProduct) return res.status(404).json({ message: `Product ${productId} not found` });

    const storeRecord = await LikeModel.create({ user: userId, product: productId });
    res.status(200).json({ success: true, body: storeRecord });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const GetAllLikeProductPerUser = async (req, res) => {
  try {
    const userId = req.query.userId || "";

    if (!userId) {
      return res.status(404).json({ error: 'Not Found' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid or missing userId" });
    }

    const allLikeProduct = await LikeModel.find({ user: userId })
      .populate("product")
      .lean();

    res.status(200).json({ success: true, body: allLikeProduct });
  } catch (error) {
    res.status(404).json(error);
  }
};

// ---------------------- RECENTLY VIEWED ----------------------

const RecentlyViewProduct = async (req, res) => {
  const { userId, productId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid IDs" });
  }

  try {
    const [validateUser, validateProduct] = await Promise.all([
      UserModel.findById(userId).lean(),
      ProductModel.findById(productId).lean(),
    ]);

    if (!validateUser) return res.status(404).json({ message: `User ${userId} not found` });
    if (!validateProduct) return res.status(404).json({ message: `Product ${productId} not found` });

    const storeRecord = await ViewModel.create({ user: userId, product: productId });
    res.status(200).json({ success: true, body: storeRecord });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const GetAllRecentlyViewProductPerUser = async (req, res) => {
  try {
    const userId = req.query.userId || "";

    if (!userId) {
      return res.status(404).json({ error: 'Not Found' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid or missing userId" });
    }

    const allRecentlyViewModel = await ViewModel.find({ user: userId })
      .populate("product")
      .lean();

    res.status(200).json({ success: true, body: allRecentlyViewModel });
  } catch (error) {
    res.status(404).json(error);
  }
};

module.exports = {
  AccountLogin,
  AccountUserValidate,
  AddUser,
  UpdateUserAddress,
  LikeProduct,
  GetAllLikeProductPerUser,
  RecentlyViewProduct,
  GetAllRecentlyViewProductPerUser,
  AccountUserLogout,
};
