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

    imageUrls: {
      type: [String],
      default: [],
      validate: [
        {
          validator: (arr) => arr.length <= 4,
          message: "You can upload up to 4 images per comment",
        },
        {
          validator: (arr) =>
            arr.every((url) => /\.(jpe?g|png|gif)$/i.test(url)),
          message: "Each imageUrl must end in JPG/PNG/GIF",
        },
      ],
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

// Index postId for fast lookup of a post's comments
CommentSchema.index({ postId: 1, createdAt: -1 });

// Strip __v on toJSON
CommentSchema.methods.toJSON = function () {
  const cObj = this.toObject();
  delete cObj.__v;
  return cObj;
};

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
