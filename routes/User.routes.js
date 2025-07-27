const express = require("express");
const UserRouter = new express.Router();
const { AddUser } = require("../controllers/User.controller");

UserRouter.post("/api/users", AddUser);

module.exports = UserRouter;
