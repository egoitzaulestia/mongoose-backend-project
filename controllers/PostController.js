const Post = require("../models/Post");
const User = require("../models/User");

const PostController = {
  async create(req, res) {
    try {
      const post = await Post.create(req.body);

      res.status(201).send({
        message: "Post created successfully",
        post,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Proble while creating a post",
        error,
      });
    }
  },

  async getAll(req, res) {
    try {
      // Pagination method for the posts
      const { page = 1, limit = 10 } = req.query;

      const posts = await Post.find()
        // .populate()
        .limit(limit)
        .skip((page - 1) * limit);

      res.status(200).send(posts);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "There was an error while loading the posts",
        error,
      });
    }
  },

  // NOTE: Improve validation
  async update(req, res) {
    try {
      const post = await Post.findByIdAndUpdate(
        req.params._id,
        {
          $set: req.body,
          $inc: { __v: 1 },
        },
        { new: true }
      );
      res.status(200).send({
        message: "Post updated successfully",
        post,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Error while updating the post",
        error,
      });
    }
  },

  async delete(req, res) {
    try {
      const post = await Post.findByIdAndDelete(req.params._id);
      res.status(200).send({
        message: "Post deleted successfully",
        post,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Server error while deleting the post",
      });
    }
  },

  async getByTitle(req, res) {
    try {
      if (req.params.title.length > 150) {
        return res.status(400).send({ message: "Too long search..." });
      }
      //   const posts = await Post.find({
      //     $text: {
      //       $search: `"${req.params.title}"`,
      //     },
      //   });

      const posts = await Post.find({
        title: { $regex: req.params.title, $options: "i" },
      });

      res.status(200).send(posts);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Server error while shearching titles",
        error,
      });
    }
  },

  async getById(req, res) {
    try {
      const post = await Post.findById(req.params._id);
      res.status(200).send(post);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Server error while searching post by ID",
        error,
      });
    }
  },

  async like(req, res) {
    try {
      const post = await Post.findByIdAndUpdate(
        req.params._id,
        { $push: { likes: req.user._id } },
        { new: true }
      );

      res.status(200).send(post);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Server error while giving a like",
      });
    }
  },
};

module.exports = PostController;
