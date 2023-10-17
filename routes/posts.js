const validateObjectId = require("../middleware/validateObjectId");
const { Post, validate } = require("../models/post");
const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  const posts = await Post.find().populate("comments");
  res.send(posts);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const post = await Post.findById(req.params.id).populate("comments");

  if (!post)
    return res.status(404).send("The post with the given ID was not found.");

  res.send(post);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    img: req.body.img,
    category: req.body.category,
    rating: req.body.rating,
  });
  try {
    const result = await post.save();
    res.send(result);
    console.log(result);
  } catch (ex) {
    for (field in ex.errors) console.log(ex.errors[field].message);
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const post = await Post.findByIdAndUpdate(req.params.id, {
    $set: {
      title: req.body.title,
      description: req.body.description,
      img: req.body.img,
      category: req.body.category,
      rating: req.body.rating,
    },
  });

  if (!post)
    return res.status(404).send("The post with the given ID was not found.");

  res.send(post);
});

router.delete("/:id", async (req, res) => {
  const post = await Post.findByIdAndRemove(req.params.id);

  if (!post)
    return res.status(404).send("The task with the given ID was not found.");

  res.send(post);
});

module.exports = router;
