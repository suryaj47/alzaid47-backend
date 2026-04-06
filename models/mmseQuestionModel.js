const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  section: String,
  question: String,
  type: String,
  answer: String,
  answers: [String],
  options: [String],
  marks: Number
});

module.exports = mongoose.model("MMSEQuestion", questionSchema);