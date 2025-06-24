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
        .populate("author", "name email")
        .populate("postId", "title")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit);

      const total = await Comment.countDocuments();

      res.status(200).json({
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        comments,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Server error while retriving all comments of the database",
        error,
      });
    }
  },

  async getCommentsByPost(req, res) {
    try {
      const { postId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      if (!ObjectId.isValid(postId)) {
        return res.status(400).json({ message: "Invalid postId format" });
      }

      const postExists = await Post.exists({ _id: postId });
      if (!postExists) {
        return res.status(404).json({ message: "Post not found" });
      }

      const comments = await Comment.find({ postId }).populate(
        "author",
        "name email"
      );
      sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      const total = await Comment.countDocuments({ postId });

      res.status(200).json({
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        comments,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Server error while retrieving comments for the post",
        error,
      });
    }
  },

  // POST /comments/:commentId/like
  async likeComment(req, res) {
    try {
      const { commentId } = req.params;
      const userId = req.user._id;

      // Validate ID
      if (!ObjectId.isValid(commentId)) {
        return res.status(400).json({
          message: "Invalid commentId",
        });
      }

      // Ensure the comment exists
      const exists = await Comment.exists({ _id: commentId });
      if (!exists) {
        return res.status(404).json({
          message: "Comment not found",
        });
      }

      // Check already liked
      const already = await Comment.exists({
        _id: commentId,
        "likes.userId": userId,
      });
      if (already) {
        return res.status(400).json({
          message: "You've already liked this comment",
        });
      }

      // Push the like subdoc
      const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
          $push: { likes: { userId } },
        },
        { new: true }
      ).populate("likes.userId", "name"); // show who liked (we can omit this later)

      return res.status(200).json({
        message: "Comment liked",
        comment,
      });
    } catch (err) {
      console.error("CommentController.likeComment error:", err);
      return res.status(500).json({
        message: "Server error while liking comment",
        error: err,
      });
    }
  },

  // DELETE /comments/:commentId/like
  async unlikeComment(req, res) {
    try {
      const { commentId } = req.params;
      const userId = req.user._id;

      // Validate ID
      if (!ObjectId.isValid(commentId)) {
        return res.status(400).json({ message: "Invalid commentId" });
      }

      // Ensure like exists
      const already = await Comment.exists({
        _id: commentId,
        "likes.userId": userId,
      });
      if (!already) {
        return res
          .status(400)
          .json({ message: "You have't liked this comment." });
      }

      // Pull the like subdoc
      const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
          $pull: { likes: { userId } },
        },
        { new: true }
      ).pupulate("likes.userId", "name");

      return res.status(200).json({
        message: "Comment unliked",
        comment,
      });
    } catch (err) {
      return res.status(200).json({
        message: "Server error while unliking comment",
        error: err,
      });
    }
  },
};

module.exports = CommentController;
