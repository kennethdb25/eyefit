const express = require("express");
const UserRouter = new express.Router();
const { AccountLogin, AccountUserValidate, AddUser } = require("../controllers/User.controller");
const { ValidateUserAccount } = require("../middlewares/Authenticate");

UserRouter.post("/api/users", AddUser);

// LOGIN AND VALIDATE //
UserRouter.post("/api/users/login", AccountLogin);
UserRouter.get("/api/users/validate", ValidateUserAccount, AccountUserValidate);
// --------------- **** -------------- //

module.exports = UserRouter;
