const Comment = require("../models/Comment");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const isCommentAuthor = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    if (!ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "comment not found" });
    }

    if (!comment.author.equals(req.user._id)) {
      return res.status(403).json({
        message: "You are not the author of this comment",
      });
    }

    next();
  } catch (err) {
    console.error("isCommentAuthor error:", err);
    return res.status(500).json({
      message: "Error while verifying comment authorship",
      error: err,
    });
  }
};

module.exports = { isCommentAuthor };
