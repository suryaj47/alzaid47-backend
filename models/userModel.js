const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: { type: String, required: true },

  username: { type: String, required: true, unique: true },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  resetToken: String,
  resetTokenExpiry: Date,

  createdAt: {
    type: Date,
    default: Date.now
  },

  age: {
    type: Number,
    default: null
  },

  gender: {
    type: String,
    default: null
  },

  profileImage: {
    type: String,
    default: ""
  },


});

module.exports = mongoose.model("User", userSchema);