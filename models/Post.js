const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;
const { isURL } = require("validator");

// Subdocument schema with timestamps for each like
const LikeSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
  },

  { timestamps: true }
);

// Post schema
const PostSchema = new mongoose.Schema(
  {
    author: {
      type: ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },

    title: {
      type: String,
      trim: true,
      maxlength: [100, "Title too long"],
    },

    content: {
      type: String,
      required: [true, "Content is required"],
      minlength: 1,
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
      type: [LikeSchema], // Like subdocument schema
      default: [],
    },
  },

  { timestamps: true }
);

// Full-text search index on both 'title' and 'content'
PostSchema.index({
  title: "text",
  content: "text",
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
