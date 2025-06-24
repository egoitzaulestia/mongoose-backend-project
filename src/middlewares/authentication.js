const User = require("../models/User");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const authentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).send({ message: "Not valid token" });
    }

    const payload = jwt.verify(token, JWT_SECRET);
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

const isAdmin = async (req, res, next) => {
  try {
    const admins = ["admin", "superadmin"];

    if (!admins.includes(req.user.role)) {
      return res.status(403).send({ message: "You do not have permission" });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Authorization error", error });
  }
};

// const isAuthor = async (req, res, next) => {
//   try {
//     const order = await
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({
//       error,
//       message: "There was an error while checking the authority of the order",
//     });
//   }
// };

module.exports = { authentication, isAdmin };
