const mongoose = require("mongoose");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const { trim } = require("validator");
const ObjectId = mongoose.Types.ObjectId;

const CommentController = {
  async create(req, res) {
    try {
      const { postId } = req.params;
      const { content } = req.body;
      const userId = req.user._id;

      // Validate postId & content
      if (!ObjectId.isValid(postId)) {
        return res.status(400).json({ message: "Invalid postId" });
      }

      if (!content?.trim()) {
        return res.status(400).json({
          message: "Content is required",
        });
      }

      // Ensure the post exists
      const postExists = await Post.exists({ _id: postId });
      if (!postExists) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Map any uploaded files to URLs
      const imageUrls = req.files?.map((f) => `/uploads/${f.filename}`) || [];

      const comment = await Comment.create({
        postId,
        author: userId,
        content: content.trim(),
        imageUrls,
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

  /**
   * GET /comments/detailed
   * returns each comment + comment author +
   *   the post it belongs to + that post’s author +
   *   the users who’ve liked the comment
   */
  async getDetailed(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;
      const perPage = parseInt(limit);

      const [total, comments] = await Promise.all([
        Comment.countDocuments(),
        Comment.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(perPage)
          // comment -> author, post, post.author, likes.userId
          .populate("author", "name email")
          .populate({
            path: "postId",
            populate: { path: "author", select: "name email" },
          })
          .populate("likes.userId", "name"),
      ]);

      return res.status(200).json({
        total,
        paga: parseInt(page),
        pages: Math.ceil(total / perPage),
        comments,
      });
    } catch (err) {
      console.error("CommentController.getDetailed:", err);
      return res.status(500).json({
        message: "Server error loading detailed comments",
        error: err,
      });
    }
  },

  // GET /comments/:commentId/detailed
  async getOneDetailed(req, res) {
    try {
      const { commentId } = req.params;
      if (!ObjectId.isValid(commentId)) {
        return res.status(400).json({ message: "Invalid commentId" });
      }

      const comment = await Comment.findById(commentId)
        .populate("author", "name email")
        .populate({
          path: "postId",
          populate: { path: "author", select: "name email" },
        })
        .populate("likes.userId", "name");

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      return res.status(200).json({ comment });
    } catch (err) {
      console.error("CommentController.getOneDetailedm:", err);
      return res.status(500).json({
        message: "Server error loading comment",
        error: err,
      });
    }
  },

  /**
   * PUT  /comments/:commentId
   * Only the comment’s author can hit this (enforced in middleware)
   */
  // async updateComment(req, res) {
  //   try {
  //     const { commentId } = req.params;
  //     const { content, imageUrl } = req.body;

  //     // Validate input
  //     if (!content?.trim()) {
  //       return res.status(400).json({ message: "Content cannot be empty" });
  //     }

  //     // Perform the update
  //     const comment = await Comment.findByIdAndUpdate(
  //       commentId,
  //       {
  //         $set: {
  //           content: content.trim(),
  //           ...(imageUrl !== undefined && { imageUrl }),
  //         },
  //         $inc: { __v: 1 },
  //       },
  //       { new: true }
  //     )
  //       .populate("author", "name email")
  //       .populate({
  //         path: "postId",
  //         select: "title author",
  //         populate: { path: "author", select: "name email" },
  //       });

  //     return res.status(200).json({
  //       message: "Comment updated successfully",
  //       comment,
  //     });
  //   } catch (err) {
  //     console.error("CommentController.updateComment:", err);
  //     return res.status(500).json({
  //       message: "Server error while updating comment",
  //       error: err,
  //     });
  //   }
  // },

  async updateComment(req, res) {
    try {
      const { commentId } = req.params;
      const { content } = req.body;

      // Validate inputs
      if (!ObjectId.isValid(commentId)) {
        return res.status(400).json({ message: "Invalid commentId" });
      }
      if (!content?.trim()) {
        return res.status(400).json({ message: "Content cannot be empty" });
      }

      // Fetch the comment
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      // Update text
      comment.content = content.trim();

      // Append new images (if any), but cap at 4 total
      if (req.files && req.files.length > 0) {
        const newUrls = req.files.map((f) => `/uploads/${f.filename}`);
        comment.imageUrls = comment.imageUrls.concat(newUrls).slice(0, 4);
      }

      await comment.save();

      // populate author + post.author
      await comment.populate([
        { path: "author", select: "name email" },
        {
          path: "postId",
          select: "title author",
          populate: { path: "author", select: "name email" },
        },
      ]);

      res.status(200).json({
        message: "Comment updated successfully",
        comment,
      });
    } catch (err) {
      console.error("CommentController.updateComment:", err);
      return res.status(500).json({
        message: "Server error while updating comment",
        error: err,
      });
    }
  },

  /**
   * DELETE  /comments/:commentId
   * Only the comment’s author can hit this (enforced in middleware)
   */
  async deleteComment(req, res) {
    try {
      const { commentId } = req.params;

      const comment = await Comment.findByIdAndDelete(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      return res.status(200).json({
        message: "Comment deleted successfully",
        comment,
      });
    } catch (err) {
      console.error("CommentController.deleteComment:", err);
      return res.status(500).json({
        message: "Server error while deleting comment",
        error: err,
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
      ).populate("likes.userId", "name");

      return res.status(200).json({
        message: "Comment unliked",
        comment,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Server error while unliking comment",
        error: err,
      });
    }
  },
};

module.exports = CommentController;
