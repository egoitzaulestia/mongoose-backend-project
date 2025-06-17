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

  async confirm(req, res) {
    try {
      const token = req.params.emailToken;
      const payload = jwt.verify(token, jwt_secret);

      // Find the user by email and update the 'confirmed' field
      const user = await User.findOneAndUpdate(
        { email: payload.email },
        { confirmed: true },
        { new: true } // returns the updated document
      );

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      res.status(200).send({ message: "User confirmed successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Error while confirming by email",
        error,
      });
    }
  },

  async login(req, res) {
    try {
      const user = await User.findOne({
        email: req.body.email,
      });

      const token = jwt.sign({ _id: user._id }, jwt_secret, {
        expiresIn: "7d",
      });

      if (user.tokens.length > 3) user.tokens.shift();
      await user.save();

      res.status(200).send({ message: `Welcome ${user.name} :)`, token });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Login error", error });
    }
  },
};

module.exports = UserController;
