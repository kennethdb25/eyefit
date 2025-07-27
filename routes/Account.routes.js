const express = require("express");
const AccountRouter = new express.Router();
const {
  AccountSignup,
  ForgotPasswordVerifyEmail,
  ForgotPasswordUpdatePassword,
  AccountLogin,
  AccountValidate,
  AccountLogout,
} = require("../controllers/Account.controller");
const ValidateAccount = require("../middlewares/Authenticate");

// LOGIN AND VALIDATE //
AccountRouter.post("/api/user/login", AccountLogin);
AccountRouter.get("/api/user/validate", ValidateAccount, AccountValidate);
// --------------- **** -------------- //

// LOGOUT//
AccountRouter.get("/api/user/logout", ValidateAccount, AccountLogout);
// --------------- **** -------------- //

// SIGN UP //
AccountRouter.post("/api/user/registration", AccountSignup);
// --------------- **** -------------- //

// FORGOT PASSWORD //
AccountRouter.get(
  "/api/user/forgot-password/:email",
  ForgotPasswordVerifyEmail
);
AccountRouter.patch(
  "/api/user/forgot-password/:email",
  ForgotPasswordUpdatePassword
);
// --------------- **** -------------- //

module.exports = AccountRouter;
