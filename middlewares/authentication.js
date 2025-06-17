const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config/keys");

const authentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).send({ message: "Not valid token" });
    }

    const payload = jwt.verify(token, jwt_secret);
    const user = await User.findOne({ _id: payload._id, tokens: token });

    if (!user) {
      return res.status(401).send({ message: "You are not authorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "There was a problem with the token",
      error,
    });
  }
};

module.exports = { authentication };
