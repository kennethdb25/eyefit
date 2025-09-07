const express = require("express");
const UserRouter = new express.Router();
const {
    AccountLogin,
    AccountUserValidate,
    AddUser,
    LikeProduct,
    GetAllLikeProductPerUser,
    RecentlyViewProduct,
    GetAllRecentlyViewProductPerUser
} = require("../controllers/User.controller");
const { ValidateUserAccount } = require("../middlewares/Authenticate");

UserRouter.post("/api/users", AddUser);

// LOGIN AND VALIDATE //
UserRouter.post("/api/users/login", AccountLogin);
UserRouter.get("/api/users/validate", ValidateUserAccount, AccountUserValidate);
// --------------- **** -------------- //

UserRouter.post("/api/users/like", LikeProduct)

UserRouter.get("/api/users/like", GetAllLikeProductPerUser)

UserRouter.post("/api/users/view", RecentlyViewProduct)

UserRouter.get("/api/users/view", GetAllRecentlyViewProductPerUser)

module.exports = UserRouter;
