const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config/keys");

const UserController = {
  async register(req, res) {
    try {
      const user = await User.create({ ...req.body, role: "user" });
      res.status(201).send({ message: "User registered successfully", user });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Error while trying to regist a user", error });
    }
  },
};

module.exports = UserController;
