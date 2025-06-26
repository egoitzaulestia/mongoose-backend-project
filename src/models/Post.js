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

    imageUrls: {
      type: [String],
      default: [],
      validate: [
        {
          // No more thatn 4 images
          validator: (arr) => arr.length <= 4,
          message: "You can upload up to 4 images per post",
        },
        {
          validator: (arr) =>
            // each string ends in .jpg/.jpeg/.png/.gif (case-insensitive)
            arr.every((v) => /\.(jpe?g|png|gif)$/i.test(v)),
          message: "Each imageUrl must end in JPG/PNG/GIF",
        },
      ],
    },

    likes: {
      type: [LikeSchema], // Like subdocument schema
      default: [],
    },
  },

  { timestamps: true }
);

PostSchema.virtual("comments", {
  ref: "Comment", // the model to use
  localField: "_id", // find comments where `postId` === `_id`
  foreignField: "postId", // in Comment shcema
  justOne: false, // we want an array
});

// Full-text search index on both 'title' and 'content'
PostSchema.index({
  title: "text",
  content: "text",
});

PostSchema.set("toObject", { virtuals: true });
PostSchema.set("toJSON", { virtuals: true });

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
