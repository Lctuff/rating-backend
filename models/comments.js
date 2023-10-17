const Joi = require("joi");
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },

  text: {
    type: String,
    required: true,
  },
});

const Comment = mongoose.model("Comment", commentSchema);

exports.Comment = Comment;
