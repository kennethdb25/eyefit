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
UserRouter.post("/api/user/login", AccountLogin);
UserRouter.get("/api/user/validate", ValidateAccount, AccountValidate);
// --------------- **** -------------- //

// LOGOUT//
UserRouter.get("/api/user/logout", ValidateAccount, AccountLogout);
// --------------- **** -------------- //

// SIGN UP //
UserRouter.post("/api/user/registration", AccountSignup);
// --------------- **** -------------- //

// FORGOT PASSWORD //
UserRouter.get("/api/user/forgot-password/:email", ForgotPasswordVerifyEmail);
UserRouter.patch(
  "/api/user/forgot-password/:email",
  ForgotPasswordUpdatePassword
);
// --------------- **** -------------- //

module.exports = UserRouter;
