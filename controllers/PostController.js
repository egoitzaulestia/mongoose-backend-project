const Post = require("../models/Post");

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
};

module.exports = PostController;
