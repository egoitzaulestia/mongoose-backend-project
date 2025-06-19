const Post = require("../models/Post");

const PostController = {
  async create(req, res) {
    try {
      const post = Post.create(req.body);

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
};

module.exports = PostController;
