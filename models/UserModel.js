const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const cipher = require("bcryptjs");
const keys = require("../config/keys");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validator(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Not a valid email");
      }
    },
  },
  contact: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  acctStatus: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});



UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await cipher.hash(this.password, 12);
  }
  next();
});

UserSchema.methods.generateAuthToken = async function () {
  try {
    let token24 = jwt.sign({ _id: this._id }, keys.cookieKey, {
      expiresIn: "7d",
    });

    this.tokens = this.tokens.concat({ token: token24 });
    await this.save();
  } catch (error) {
    console.log(error);
  }
};

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
