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

    // readList: [{ type: ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

UserSchema.index({
  name: "text",
});

// We avoid returning tokens array and password
UserSchema.methods.toJSON = function () {
  const userObject = this.toObject(); // This is safer than accessing ._doc directly
  delete userObject.tokens;
  delete userObject.password;
  return userObject;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
