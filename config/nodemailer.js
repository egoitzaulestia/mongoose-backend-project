require("dotenv").config();
const nodemailer = require("nodemailer");
const { email_user, email_pass } = require("./keys").credentials;

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: email_user,
    pass: email_pass,
  },
});

module.exports = transporter;
