const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const transporter = require("../config/nodemailer");

//TO DO -> work in validtions (404, etc.) ...
const UserController = {
  // Registration (with optional photo upload)
  async register(req, res, next) {
    try {
      // hash the password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      // build the new user payload
      const newUserData = {
        ...req.body,
        password: hashedPassword,
        role: "user",
        confirmed: false,
      };

      // if multer saw a file, add its URL
      if (req.file) {
        newUserData.photoUrl = `/uploads/${req.file.filename}`;
      }

      const user = await User.create(newUserData);

      // send email confirmation
      const emailToken = jwt.sign({ email: user.email }, JWT_SECRET, {
        expiresIn: "48h",
      });
      const url = `http://localhost:3000/users/confirm/${emailToken}`;

      await transporter.sendMail({
        to: user.email,
        subject: "Confirm your registration",
        html: `
          <h3>Welcome, ${user.name}</h3>
          <p>Click <a href="${url}">here</a> to confirm your account.</p>
        `,
      });

      res.status(201).json({
        message: "User registered successfully",
        user, // thanks to toJSON(), no password or tokens leak out
      });
    } catch (error) {
      error.origin = "user";
      next(error);
    }
  },

  async confirm(req, res) {
    try {
      const token = req.params.emailToken;
      const payload = jwt.verify(token, JWT_SECRET);

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

      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      if (user.tokens.length > 3) user.tokens.shift();
      user.tokens.push(token);
      // user.tokens = [...user.tokens, token].slice(-3); // Othre option to story the token in the array
      await user.save();

      res.status(200).send({
        message: `Welcome ${user.name} :)`,
        user: user.toSafe(),
        token,
      });
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

  // (ongoing) needs to be adapetd to get post and comments
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

  async getProfile(req, res) {
    try {
      const meId = req.user._id;

      // Grab fresh user doc, populating follower/following names
      const me = await User.findById(meId)
        .select("name email followers following") // only the fields we need
        .populate("followers", "name") // array of { _id, name }
        .populate("following", "name");

      if (!me) {
        return res.status(404).json({
          message: "User not found.",
        });
      }

      // Fetch my posts (just ids, titles, dates)
      const myPosts = await Post.find({ author: meId })
        .sort({ createdAt: -1 })
        .select("_id title createdAt");

      // Fetch 'my' comments, incliding which post
      const myComments = await Comment.find({ author: meId })
        .sort({ createdAt: -1 })
        .select("_id content createdAt postId")
        .populate("postId", "title"); // just the post title

      return res.status(200).json({
        user: {
          _id: me._id,
          name: me.name,
          email: me.email,
        },
        stats: {
          followersCount: me.followers.length,
          followingCount: me.following.length,
        },
        followers: me.followers, // [{ _id, name }, ...]
        folliwing: me.following, // [{ _id, name }, ...]
        posts: myPosts, // [{ _id, title, createdAt }, ...]
        comments: myComments, // [{ _id, content, createdAt, postId:{_id, title}, ...}]
      });
    } catch (err) {
      console.error("UserController.getProfile error:", err);
      res.status(500).json({
        message: "Server error",
        error: err,
      });
    }
  },

  // (ongoing) needs to be adapetd to get post and comments
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

  // (perhaps) needs to be adapetd to get post and comments
  async getAll(req, res) {
    try {
      const users = await User.find();
      res.status(200).send(users);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        messgae: "It was an erro in the server while retrieving the users",
        error,
      });
    }
  },

  async update(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params._id,
        {
          $set: req.body,
          $inc: { __v: 1 },
        },
        { new: true }
      );

      res.status(200).send({
        message: "User updated successfully",
        user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Server error while updating user information",
        error,
      });
    }
  },

  async delete(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params._id);
      res.status(204).send({
        message: "User deleted",
        user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Server error while deleting the user",
        error,
      });
    }
  },

  // Separate “upload photo” endpoint
  async uploadPhoto(req, res, next) {
    try {
      // multer middleware already sent 400 if no file or wrong type/size
      const photoUrl = `/uploads/${req.file.filename}`;

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { photoUrl, $inc: { __v: 1 } },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        message: "Profile photo updated successfully",
        user,
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /users/:id/follow
  async follow(req, res) {
    try {
      const meId = req.user._id;
      const otherId = req.params.id;

      if (meId.equals(otherId)) {
        return res.status(400).json({
          message: "You cannot follow yourself.",
        });
      }

      // ensure both exist
      const [me, other] = await Promise.all([
        User.findById(meId),
        User.findById(otherId),
      ]);
      if (!other) {
        return res.status(404).json({
          message: "User not found.",
        });
      }

      // already following?
      if (me.following.includes(otherId)) {
        return res.status(400).json({
          message: "You already follow this user.",
        });
      }

      // push into each side's array
      me.following.push(otherId);
      other.followers.push(meId);

      await Promise.all([me.save(), other.save()]);

      return res.status(200).json({
        message: `You are now following ${other.name}`,
        following: me.following,
        followersCount: other.followers.length,
      });
    } catch (error) {
      console.error("UserController.follow:", error);
      res.status(500).json({
        message: "Server error while trying to follow this user",
        error: error,
      });
    }
  },

  // DELETE /users/:id/follow
  async unfollow(req, res) {
    try {
      const meId = req.user._id;
      const otherId = req.params.id;

      if (meId.equals(otherId)) {
        return res.status(400).json({
          message: "You cannot unfollow yourself.",
        });
      }

      const [me, other] = await Promise.all([
        User.findById(meId),
        User.findById(otherId),
      ]);
      if (!other) {
        return res.status(404).json({
          message: "You cannot unfollow yourself.",
        });
      }

      // must be following firs
      if (!me.following.includes(otherId)) {
        return res.status(400).json({ message: "You don't follow this user." });
      }

      // remove from both array
      me.following = me.following.filter((id) => !id.equals(otherId));
      other.followers = other.followers.filter((id) => !id.equals(meId));

      await Promise.all([me.save(), other.save()]);

      return res.status(200).json({
        message: `You unfollowed ${other.name}`,
        following: me.following,
        followersCount: other.followers.length,
      });
    } catch (error) {
      console.error("UserController.unfollow:", error);
      res.status(500).json({
        message: "Server error while unfollowing this user",
      });
    }
  },
};

module.exports = UserController;
