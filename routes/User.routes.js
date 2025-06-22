const express = require("express");
const UserRouter = new express.Router();
const {
  AccountSignup,
  ForgotPasswordVerifyEmail,
  ForgotPasswordUpdatePassword,
  AccountLogin,
  AccountValidate,
  AccountLogout,
} = require("../controllers/User.controller");
const ValidateAccount = require("../middlewares/Authenticate");

// LOGIN AND VALIDATE //
UserRouter.post("/api/login", AccountLogin);
UserRouter.get("/api/validate", ValidateAccount, AccountValidate);
// --------------- **** -------------- //

// LOGOUT//
UserRouter.get("/api/logout", ValidateAccount, AccountLogout);
// --------------- **** -------------- //

// SIGN UP //
UserRouter.post("/api/registration", AccountSignup);
// --------------- **** -------------- //

// FORGOT PASSWORD //
UserRouter.get("/api/forgot-password/:email", ForgotPasswordVerifyEmail);
UserRouter.patch("/api/forgot-password/:email", ForgotPasswordUpdatePassword);
// --------------- **** -------------- //

module.exports = UserRouter;
