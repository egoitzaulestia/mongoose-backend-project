const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config/keys");
const transporter = require("../config/nodemailer");

const UserController = {
  async register(req, res) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const user = await User.create({
        ...req.body,
        password: hashedPassword,
        role: "user",
        confirmed: false,
      });

      const emailToken = jwt.sign({ email: req.body.email }, jwt_secret, {
        expiresIn: "48h",
      });

      const url = `http://localhost:3000/users/confirm/${emailToken}`;

      await transporter.sendMail({
        to: req.body.email,
        subject: "Confirm your regist",
        html: `
          <h3>Welcome, you are almost there </h3>
          <a href=${url}>Click here to confirm your regist</a>
        `,
      });

      res.status(201).send({
        message: "User registered successfully",
        user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Error while trying to regist a user",
        error,
      });
      //   next(error)
    }
  },
};

module.exports = UserController;
