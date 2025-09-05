const AccountModel = require("../models/AccountModel");
const cipher = require("bcryptjs");
// const LoginHistoryModel = require("../models/LoginHistoryModel");

const AccountLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userEmail = await AccountModel.findOne({
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

const AccountLogout = async (req, res) => {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter((currElem) => {
      return currElem != req.token;
    });
    res.clearCookie("UserCookie", { path: "/" });

    req.rootUser.save();

    return res.status(201).json({ success: true });
  } catch (error) {
    console.log(error);
  }
};

const AccountValidate = async (req, res) => {
  try {
    const validAccount = await AccountModel.findOne({ _id: req.userId });
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

  console.log(req.body)

  try {
    const validate = await AccountModel.findOne({ email });

    if (userType !== "ADMIN USER") {
      const validateCompany = await AccountModel.findOne({ company });

      if (validate || validateCompany) {
        return res.status(422).json({ error: "Account Already Exists" });
      }
    }

    if (validate) {
      return res.status(422).json({ error: "Account Already Exists" });
    }
    const userDetails = new AccountModel({
      firstName: firstName.toUpperCase(),
      middleName: middleName.toUpperCase(),
      lastName: lastName.toUpperCase(),
      address: address.toUpperCase(),
      company: company ? company.toUpperCase() : "ADMIN USER",
      contact,
      userType: userType ? userType : "USER",
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

const ForgotPasswordVerifyEmail = async (req, res) => {
  try {
    const getEmail = await AccountModel.findOne({
      email: req.params.email,
      userType: "STUDENT",
    });
    if (getEmail) {
      return res.status(200).json({
        success: true,
        body: "Email Matched. Please click send button for OTP",
      });
    } else {
      return res
        .status(422)
        .json({ status: 422, body: "Email didn't match our records" });
    }
  } catch (error) {
    res.status(404).json(error);
  }
};

const ForgotPasswordUpdatePassword = async (req, res) => {
  console.log(req?.params.email);

  try {
    const email = req?.params.email;
    const password = await cipher.hash(req.body.password, 12);

    const getEmail = await AccountModel.findOne({
      email: email,
      userType: "STUDENT",
    });

    if (!getEmail) {
      return res.status(401).json({
        body: "Something went wrong. Please contact your Administrator!",
      });
    }

    await getEmail.updateOne({
      password: password,
    });

    return res
      .status(200)
      .json({ success: true, body: "Recovered Successfully" });
  } catch (error) {
    return res.status(404).json(error);
  }
};

const GetAllAccountUser = async (req, res) => {
  try {
    const allAccountUser = await AccountModel.find();

    return res
      .status(200)
      .json({ success: true, body: allAccountUser });
  } catch (error) {
    return res.status(404).json(error);
  }
}

const EditAccount = async (req, res) => {
  try {
    const id = req.query.userId || "";

    const {
      firstName,
      middleName,
      lastName,
      company,
      address,
      email,
      contact,
      acctStatus,
    } = req.body;

    const userAcount = await AccountModel.findOne({ _id: id })

    if (!userAcount) {
      return res.status(404).json({ error: "User Account not found." });
    }

    Object.assign(userAcount, {
      firstName,
      middleName,
      lastName,
      company,
      address,
      email,
      contact,
      acctStatus,
    });

    const updateAccount = await userAcount.save();
    res.status(200).json({ success: true, body: updateAccount });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

const AccountLoginHistory = async (req, res) => { };

module.exports = {
  AccountSignup,
  ForgotPasswordVerifyEmail,
  ForgotPasswordUpdatePassword,
  AccountLogin,
  AccountValidate,
  AccountLogout,
  GetAllAccountUser,
  EditAccount
};
