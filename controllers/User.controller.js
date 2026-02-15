const mongoose = require("mongoose");
const LikeModel = require("../models/LikeModel");
const ProductModel = require("../models/ProductModel");
const UserModel = require("../models/UserModel");
const cipher = require("bcryptjs");
const ViewModel = require("../models/ViewModel");
const jwt = require("jsonwebtoken");
const { cookieKey, baseUrl } = require("../config/keys")
const mailer = require("../utils/mailer");


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

    const token = jwt.sign({ email }, cookieKey, {
      expiresIn: "1d",
    });


    const savedUser = await UserModel.create({
      name: name.toUpperCase(),
      email,
      contact: `+63${contact}`,
      userType: "USER",
      acctStatus: "INACTIVE",
      address: address.toUpperCase(),
      gender: gender.toUpperCase(),
      password,
      verificationToken: token,
    });

    const link = `${baseUrl}/api/auth/verify/${token}`;

    await mailer.sendMail({
      from: `"Verify Account" - Eyefit Store`,
      to: email,
      subject: "Verify your account",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Verify Your Email</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:30px 0;">
    <tr>
      <td align="center">
        <table width="100%" max-width="480" cellpadding="0" cellspacing="0" style="background:white;border-radius:10px;box-shadow:0 10px 25px rgba(0,0,0,0.15);overflow:hidden;">
          <tr>
            <td style="background:linear-gradient(135deg,#2563eb,#4f46e5);padding:20px;text-align:center;color:white;">
              <h2 style="margin:0;">Welcome, ${name} 👋</h2>
            </td>
          </tr>

          <tr>
            <td style="padding:30px;text-align:center;">
              <p style="color:#374151;font-size:15px;line-height:1.6;">
                Thanks for registering! Please confirm your email address to activate your account.
              </p>

              <a href="${link}"
                 style="display:inline-block;margin:20px 0;padding:14px 28px;
                        background:#2563eb;color:white;font-weight:bold;
                        border-radius:6px;text-decoration:none;">
                Verify My Email
              </a>

              <p style="font-size:13px;color:#6b7280;">
                This link will expire in 24 hours.
              </p>

              <p style="font-size:12px;color:#9ca3af;margin-top:20px;">
                If you did not create this account, please ignore this email.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background:#f9fafb;padding:15px;text-align:center;font-size:11px;color:#9ca3af;">
              © ${new Date().getFullYear()} Eyefit Store. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
      ,
    });

    res.status(201).json({ success: true, body: savedUser });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error" });
  }
};

const VerifyUser = async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, cookieKey);

    const user = await UserModel.findOne({
      email: decoded.email,
      verificationToken: req.params.token,
    });

    if (!user) return res.status(400).send("Invalid or expired link.");

    user.acctStatus = "ACTIVE";
    user.verificationToken = null;

    await user.save();

    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Email Verified</title>
  <style>
    * {
      box-sizing: border-box;
      font-family: Arial, sans-serif;
    }

    body {
      margin: 0;
      height: 100vh;
      background: linear-gradient(135deg, #2563eb, #4f46e5);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card {
      background: white;
      padding: 40px;
      border-radius: 12px;
      max-width: 400px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
      animation: pop 0.6s ease;
    }

    .check {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: #22c55e;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      color: white;
      font-size: 36px;
    }

    h2 {
      margin-bottom: 10px;
      color: #111827;
    }

    p {
      color: #6b7280;
      margin-bottom: 25px;
    }

    a {
      display: inline-block;
      padding: 12px 25px;
      background: #2563eb;
      color: white;
      border-radius: 6px;
      text-decoration: none;
      transition: 0.3s;
    }

    a:hover {
      background: #1d4ed8;
    }

    @keyframes pop {
      from {
        transform: scale(0.8);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="check">✓</div>
    <h2>Email Verified!</h2>
    <p>Your account is now active. You can safely log in.</p>
  </div>
</body>
</html>
`);


  } catch (err) {
    console.log(err)
    res.status(400).send("Verification link expired or invalid.");
  }
}

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
  VerifyUser,
  UpdateUserAddress,
  LikeProduct,
  GetAllLikeProductPerUser,
  RecentlyViewProduct,
  GetAllRecentlyViewProductPerUser,
  AccountUserLogout,
};
