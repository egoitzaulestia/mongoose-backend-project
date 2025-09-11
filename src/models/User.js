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

// const UserSchema = new mongoose.Schema(
//   {
//     handle: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//       minlength: 3,
//       maxlength: 30,
//       match: /^[a-z0-9_]+$/i,
//     },
//     name: { type: String, required: true, trim: true },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       validate: {
//         validator: isEmail,
//         message: (props) => `${props.value} is not a valid email`,
//       },
//     },
//     password: { type: String, required: true, minlength: 6, select: false },
//     passwordChangedAt: { type: Date },

//     age: { type: Number, required: true, min: 0 },

//     photoUrl: { type: String, trim: true, default: "" },
//     bannerUrl: { type: String, trim: true, default: "" },

//     bio: { type: String, maxlength: 280 },
//     location: { type: String, maxlength: 80 },
//     website: { type: String, trim: true },

//     role: {
//       type: String,
//       enum: ["user", "admin", "superadmin"],
//       default: "user",
//       required: true,
//     },
//     confirmed: { type: Boolean, default: false },

//     // prefer refresh tokens (hashed) rather than access tokens
//     tokens: { type: [String], default: [] },

//     // If you keep these for now, expect to migrate to a Follow collection later
//     following: [{ type: ObjectId, ref: "User" }],
//     followers: [{ type: ObjectId, ref: "User" }],

//     // fast counters (optional, but great for feeds & profiles)
//     followersCount: { type: Number, default: 0 },
//     followingCount: { type: Number, default: 0 },
//     postsCount: { type: Number, default: 0 },

//     isActive: { type: Boolean, default: true },
//     suspendedUntil: { type: Date },
//     deletedAt: { type: Date },

//     passwordResetToken: { type: String },
//     passwordResetExpires: { type: Date },

//     settings: {
//       theme: {
//         type: String,
//         enum: ["light", "dark", "system"],
//         default: "system",
//       },
//       language: { type: String, default: "en" },
//       emailNotifications: { type: Boolean, default: true },
//     },
//   },
//   { timestamps: true }
// );

// // Indexes
// UserSchema.index({ name: "text", handle: "text", bio: "text" });
// UserSchema.index(
//   { handle: 1 },
//   { unique: true, collation: { locale: "en", strength: 2 } }
// );
// UserSchema.index({ email: 1 }, { unique: true });

// // Safe JSON
// UserSchema.methods.toJSON = function () {
//   const obj = this.toObject();
//   delete obj.password;
//   delete obj.tokens;
//   delete obj.__v;
//   return obj;
// };

// UserSchema.methods.toSafe = function () {
//   const {
//     _id,
//     handle,
//     name,
//     email,
//     role,
//     photoUrl,
//     confirmed,
//     followersCount,
//     followingCount,
//     postsCount,
//     createdAt,
//     updatedAt,
//   } = this;
//   return {
//     id: _id.toString(),
//     handle,
//     name,
//     email,
//     role,
//     photoUrl,
//     confirmed,
//     followersCount,
//     followingCount,
//     postsCount,
//     createdAt: createdAt?.toISOString?.() ?? createdAt,
//     updatedAt: updatedAt?.toISOString?.() ?? updatedAt,
//   };
// };

const User = mongoose.model("User", UserSchema);

module.exports = User;

/////////////////////////////
/////////////////////////////
