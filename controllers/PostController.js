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
};

module.exports = PostController;
