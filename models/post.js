const Joi = require("joi");
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },

  rating: {
    type: Number,
    required: true,
    max: 5,
  },
  comments: [],
});

const Post = mongoose.model("Post", postSchema);

function validatePost(post) {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    img: Joi.string().required(),
    rating: Joi.number().required(),
  });
  return schema.validate(post);
}

exports.Post = Post;
exports.validate = validatePost;
