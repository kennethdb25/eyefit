// utils/mailer.js
const nodemailer = require("nodemailer");
const { email, emailPass } = require("../config/keys")

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: email,
        pass: emailPass,
    },
});

module.exports = transporter;
