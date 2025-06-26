const { parse } = require("dotenv");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Post = require("../models/Post");
const User = require("../models/User");
const { errorMonitor } = require("nodemailer/lib/xoauth2");

const PostController = {
  async create(req, res) {
    try {
      const author = req.user._id;

      // Build base post data
      const data = {
        author,
        ...req.body,
        imageUrls: [],
      };

      // If files uploaded, map them
      if (req.files && req.files.length > 0) {
        data.imageUrls = req.files.map((f) => `/uploads/${f.filename}`);
      }

      const post = await Post.create(data);

      res.status(201).json({
        message: "Post created successfully",
        post,
      });
    } catch (err) {
      console.error("PostController.create:", err);
      res.status(500).json({
        message: "Problem while createing a post",
        error: err,
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

      res.status(200).json({ posts });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "There was an error while loading the posts",
        error,
      });
    }
  },

  async getAllWithCommonts(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;
      const perPage = parseInt(limit);

      // Total count (for pagaination metadata)
      const total = await Post.countDocuments();

      // Fetch posts + populate author + comments + comment authors
      const posts = await Post.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .populate("author", "name email") // post author
        .populate({
          path: "comments",
          option: { sort: { createdAt: -1 } },
          populate: {
            // nested populate
            path: "author",
            select: "name email",
          },
        });

      return res.json({
        total,
        page: parseInt(page),
        pages: Math.ceil(total / perPage),
        posts,
      });
    } catch (error) {
      console.error("getAllWithComment error:", error);
      return res.status(500).json({
        message: "Server error loading posts with comments",
      });
    }
  },

  // // NOTE: Improve validation
  // async update(req, res) {
  //   try {
  //     const post = await Post.findByIdAndUpdate(
  //       req.params._id,
  //       {
  //         $set: req.body,
  //         $inc: { __v: 1 },
  //       },
  //       { new: true }
  //     );
  //     res.status(200).send({
  //       message: "Post updated successfully",
  //       post,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).send({
  //       message: "Error while updating the post",
  //       error,
  //     });
  //   }
  // },

  // async update(req, res) {
  //   try {
  //     const { _id } = req.params;

  //     // Check for a valid ObjectId
  //     if (!ObjectId.isValid(_id)) {
  //       return res.status(400).json({ message: "Invalid post ID" });
  //     }

  //     // Build the update payload
  //     const updates = {
  //       ...req.body,
  //       $inc: { __v: 1 },
  //     };

  //     if (req.files && req.files.length > 0) {
  //       this.updates.imageUrls = req.files.map((f) => `/uploads/${f.filename}`);
  //     }

  //     // Perform the update & run validators
  //     const post = await Post.findByIdAndUpdate(_id, updates, {
  //       new: true,
  //       runValidators: true,
  //     });

  //     // If no document
  //     if (!post) {
  //       return res.status(404).json({ message: "Post not found" });
  //     }

  //     return res.status(200).json({
  //       message: "Post updated successfully",
  //       post,
  //     });
  //   } catch (err) {
  //     console.error("PostController.update:", err);
  //     return res.status(500).json({
  //       message: "Error while updating the post",
  //       error: err,
  //     });
  //   }
  // },

  async update(req, res) {
    try {
      const { _id } = req.params;

      // 1) Validate the ID
      if (!ObjectId.isValid(_id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      // 2) Build your update payload
      const updates = {
        ...req.body, // title, content, etc.
        $inc: { __v: 1 },
      };

      // 3) If images were uploaded, overwrite imageUrls
      if (req.files && req.files.length > 0) {
        updates.imageUrls = req.files.map((f) => `/uploads/${f.filename}`);
      }

      // 4) Perform the update with validation
      const post = await Post.findByIdAndUpdate(_id, updates, {
        new: true,
        runValidators: true,
      });

      // 5) Handle "not found"
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // 6) Success
      return res.status(200).json({
        message: "Post updated successfully",
        post,
      });
    } catch (err) {
      console.error("PostController.update:", err);
      return res.status(500).json({
        message: "Error while updating the post",
        error: err,
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

  async likePost(req, res) {
    try {
      const { postId } = req.params;
      const userId = req.user._id;

      // First, check if already exist
      const already = await Post.exists({
        _id: postId,
        "likes.userId": userId,
      });
      if (already) {
        return res.status(400).send({
          message: "You have already liked this post.",
        });
      }

      // Add the like
      const post = await Post.findByIdAndUpdate(
        postId,
        { $push: { likes: { userId } } },
        { new: true }
      ).populate("likes.userId", "name");

      res.status(200).send({ message: "Post liked", post });
    } catch (error) {
      console.error("LikePost error:", error);
      res.status(500).send({
        message: "Error while liking post",
        error: err,
      });
    }
  },

  // // DELETE /posts/:postId/like
  async unlikePost(req, res) {
    try {
      const { postId } = req.params;
      const userId = req.user._id;

      // Ensure the like exist:
      const already = await Post.exists({
        _id: postId,
        "likes.userId": userId,
      });
      if (!already) {
        return res.status(400).send({
          message: "You haven't liked this post yet.",
        });
      }

      // Remove the like
      const post = await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: { userId } } },
        { new: true }
      ).populate("likes.userId", "name");

      res.status(200).json({ mssage: "Like removed", post });
    } catch (error) {}
    console.erre("unlikePost error", error);
    return res.status(500).send({
      message: "Error while unlikint",
      error: error,
    });
  },
};

module.exports = PostController;
