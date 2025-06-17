const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    age: Number,
    role: String,
    confirmed: Boolean,
    tokens: [],
  },
  { timestamps: true }
);

// We avoid returning tokens array and password
UserSchema.methods.toJSON = function () {
  const user = this._doc;
  delete user.tokens;
  delete user.password;
  return user;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
