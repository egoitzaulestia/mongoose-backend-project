const mongoose = require("mongoose");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const { trim } = require("validator");
const ObjectId = mongoose.Types.ObjectId;

const CommentController = {
  async create(req, res) {
    try {
      const { postId } = req.params;
      const { content, imageUrl } = req.body;
      const userId = req.user._id;

      if (!ObjectId.isValid(postId)) {
        return res.status(400).json({ message: "Invalid postId" });
      }

      if (!postId || !content?.trim()) {
        return res.status(400).json({
          message: "postId and content",
        });
      }

      const postExists = await Post.exists({ _id: postId });
      if (!postExists) {
        return res.status(404).json({ message: "Post not found" });
      }

      const comment = await Comment.create({
        postId,
        author: userId,
        content: content.trim(),
        imageUrl,
      });

      await comment.populate({
        path: "author",
        select: "name email",
      });

      res.status(201).json({
        message: "Comment created successfully",
        comment,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Server error while creating comment",
        error,
      });
    }
  },

  async getAllComments(req, res) {
    try {
      // pagination method for the posts
      const { page = 1, limit = 10 } = req.query;

      const comments = await Comment.find()
        // .populate()
        .limit(limit)
        .skip((page - 1) * limit);

      res.status(200).json({ comments });
    } catch (error) {}
  },
};

module.exports = CommentController;
