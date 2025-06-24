require("dotenv").config();
const nodemailer = require("nodemailer");
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

module.exports = transporter;
