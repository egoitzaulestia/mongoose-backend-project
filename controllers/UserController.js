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
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).send({ message: "Email and password required" });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).send({
          message: "User not found. Please register first.",
        });
      }

      if (!user.confirmed) {
        return res
          .status(400)
          .send({ message: "Please confirm your email before logging in." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send({ message: "Incorrect user or password" });
      }

      const token = jwt.sign({ _id: user._id }, jwt_secret, {
        expiresIn: "7d",
      });

      if (user.tokens.length > 3) user.tokens.shift();
      user.tokens.push(token);
      // user.tokens = [...user.tokens, token].slice(-3); // Othre option to story the token in the array
      await user.save();

      res.status(200).send({ message: `Welcome ${user.name} :)`, token });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Login error", error });
    }
  },

  async logout(req, res) {
    try {
      // Normalize the token
      const rawToken = req.headers.authorization || "";
      const token = rawToken.replace(/^Bearer\s+/i, "");

      // Romove the token from the tokens array
      const result = await User.findByIdAndUpdate(
        { _id: req.user._id },
        { $pull: { tokens: token } }
      );

      // Check if tokens array has been modified
      if (result.modifiedCount === 0) {
        return res.status(400).send({
          message: "You were already logged out or token not found",
        });
      }

      res.status(200).send({ message: `Goodbye ${req.user.name} !` });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "There was a problem trying to log out." });
    }
  },

  async getInfo(req, res) {
    try {
      //   const user = await User.findById(req.user._id).populate({
      //     path: "commentIds",
      //   });

      const user = await User.findOne(req.user._id);

      res.status(200).send(user);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Error while retriving user data", error });
    }
  },

  async getById(req, res) {
    try {
      //   const user = await User.findById(req.params._id); // ← use findById
      //   const user = await User.findOne({ _id: req.params._id });
      const user = await User.findById(req.params._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Error while retrieving the user",
        error,
      });
    }
  },

  async getByName(req, res) {
    try {
      const product = await Product.findAll({
        where: {
          name: {
            [Op.like]: `%${req.params.name}%`,
          },
        },
      });

      if (product.length === 0) {
        return res.status(404).send({ message: "No products found" });
      }

      res.status(200).send(product);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error", error });
    }
  },

  async getByName(req, res) {
    try {
      const { name } = req.params;

      const users = await User.find({
        name: { $regex: name, $options: "i" },
      });

      if (users.length === 0) {
        return res
          .status(404)
          .send({ message: `No users found matching "${name}"` });
      }
      res.status(200).send(users);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Error while seraching user by name", error });
    }
  },

  // async getAll(req, res) {
  //   try {
  //     const products = await Product.findAll({
  //       include: [
  //         { model: Category, through: { attributes: [] } },
  //         // { model: Order, through: { attributes: [] } },
  //         { model: Review },
  //       ],
  //     });

  //     res.status(200).send(products);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(200).send({ message: "Error", error });
  //   }
  // },

  // async update(req, res) {
  //   try {
  //     const [updated] = await Product.update(req.body, {
  //       where: { id: req.params.id },
  //     });

  //     if (updated === 0) {
  //       return res.status(404).send({ message: "Product not found" });
  //     }
  //     const updatedProduct = await Product.findByPk(req.params.id);
  //     await updatedProduct.addCategory(req.body.CategoryId);
  //     res.status(200).send({
  //       message: "Product updated",
  //       product: updatedProduct,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).send({ message: "Error", error });
  //   }
  // },

  //   async delete(req, res) {
  //   try {
  //     const deleted = await Product.destroy({
  //       where: { id: req.params.id },
  //     });

  //     if (deleted === 0) {
  //       return res.status(404).send({ message: 'Product not found' });
  //     }

  //     res.status(200).send({ message: 'The product has been deleted' });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).send({ message: 'Error', error });
  //   }
  // },
};

module.exports = UserController;
