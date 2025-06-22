const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const AccountModel = require("../models/AccountModel");

const ValidateAccount = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (token) {
      const verifyToken = jwt.verify(token, keys.cookieKey);

      const rootUser = await AccountModel.findOne({ _id: verifyToken._id });

      if (!rootUser) {
        return res.status(401).json({ body: "Unauthorized Access" });
      }

      req.token = token;
      req.rootUser = rootUser;
      req.userId = rootUser._id;

      next();
    }
  } catch (error) {
    return res
      .status(401)
      .json({ body: "Unauthorize User, Token is not provided", status: 401 });
  }
};

module.exports = ValidateAccount;