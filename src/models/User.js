const mongoose = require("mongoose");
const { isEmail } = require("validator");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: {
        validator: (v) => isEmail(v),
        message: (props) => `${props.value} is not a valid email`,
      },
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },

    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [0, "Age cannot be negative"],
    },

    photoUrl: {
      type: String,
      trim: true,
      default: "", // or a placeholder URL
      validate: {
        validator: (url) => !url || /\.(jpe?g|png|gif)$/i.test(url),
        message: "photoUrl must be a JPG, PNG, or GIF file",
      },
    },

    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: ["user", "admin", "superadmin"],
        message: "{VALUE} is not a valid role",
      },
    },

    confirmed: {
      type: Boolean,
      default: false,
    },

    tokens: {
      type: [String],
      default: [],
    },

    following: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],

    followers: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],

    // whishReadList: [{ type: ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

UserSchema.index({
  name: "text",
});

UserSchema.set("toJSON", { virtuals: true }); // if you use virtuals elsewhere

UserSchema.methods.toJSON = function () {
  const obj = this.toObject({ virtuals: true });
  delete obj.password;
  delete obj.tokens;
  delete obj.__v;
  return obj;
};

UserSchema.methods.toSafe = function () {
  const {
    _id,
    name,
    email,
    role,
    photoUrl,
    confirmed,
    followers,
    following,
    createdAt,
    updatedAt,
  } = this;

  return {
    id: _id.toString(),
    name,
    email,
    role,
    photoUrl,
    confirmed,
    followersCount: followers?.length ?? 0,
    followingCount: following?.length ?? 0,
    createdAt: createdAt?.toISOString?.() ?? createdAt, // nice clean ISO
    updatedAt: updatedAt?.toISOString?.() ?? updatedAt,
  };
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
