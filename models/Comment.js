const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const { isURL } = require("validator");

// sub-schema to track likes on a comment
const LikeSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, _id: false }
);

const CommentSchema = new mongoose.Schema(
  {
    postId: {
      type: ObjectId,
      ref: "Post",
      required: [true, "Comment must belong to a post"],
    },
    author: {
      type: ObjectId,
      ref: "User",
      required: [true, "Comment must have an author"],
    },
    content: {
      type: String,
      required: [true, "Comment content is required"],
      minlength: [1, "Comment cannot be empty"],
      maxlength: [500, "Comment too long"],
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => !v || (isURL(v) && /\.(jpe?g|png|gif)$/i.test(v)),
        message: "Must be a valid image URL",
      },
    },
    likes: {
      type: [LikeSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// index postId for fast lookup of a post's comments
CommentSchema.index({ postId: 1, createdAt: -1 });

CommentSchema.methods.toJSON = function () {
  const commentObject = this.toObject();
  delete commentObject.__v;
  return commentObject;
};

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
