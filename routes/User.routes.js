const express = require("express");
const UserRouter = new express.Router();
const {
    AccountLogin,
    AccountUserValidate,
    AddUser,
    UpdateUserAddress,
    LikeProduct,
    GetAllLikeProductPerUser,
    RecentlyViewProduct,
    GetAllRecentlyViewProductPerUser,
    AccountUserLogout
} = require("../controllers/User.controller");
const { ValidateUserAccount } = require("../middlewares/Authenticate");

UserRouter.post("/api/users", AddUser);

UserRouter.put("/api/users/address/:id", UpdateUserAddress);

// LOGIN AND VALIDATE //
UserRouter.post("/api/users/login", AccountLogin);
UserRouter.get("/api/users/validate", ValidateUserAccount, AccountUserValidate);
// --------------- **** -------------- //

UserRouter.get("/api/users/logout", ValidateUserAccount, AccountUserLogout);

UserRouter.post("/api/users/like", LikeProduct)

UserRouter.get("/api/users/like", GetAllLikeProductPerUser)

UserRouter.post("/api/users/view", RecentlyViewProduct)

UserRouter.get("/api/users/view", GetAllRecentlyViewProductPerUser)

module.exports = UserRouter;
