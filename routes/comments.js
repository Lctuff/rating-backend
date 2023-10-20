const validateObjectId = require("../middleware/validateObjectId");
const { Comment } = require("../models/comments");
const { Post } = require("../models/post");
const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  const comments = await Comment.find();
  res.send(comments);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment)
    return res.status(404).send("The comment with the given ID was not found.");

  res.send(comment);
});

router.post("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post)
    return res.status(404).send("The post with the given ID was not found.");

  const id = req.params.id;

  const comment = new Comment({
    text: req.body.comment,
    post: id,
  });
  try {
    const result = await comment.save();

    post.comments.push(comment);

    await post.save();

    res.send(result);
  } catch (error) {
    for (field in ex.errors) console.log(ex.errors[field].message);
  }
});

router.put("/:id", async (req, res) => {
  const comment = await Comment.findByIdAndUpdate(req.params.id, {
    $set: {
      text: req.body.comment,
    },
  });

  if (!comment)
    return res.status(404).send("The comment with the given ID was not found.");

  res.send(comment);
});

router.delete("/:id", async (req, res) => {
  const comment = await Comment.findByIdAndRemove(req.params.id);

  if (!comment)
    return res.status(404).send("The comment with the given ID was not found.");

  res.send(comment);
});

module.exports = router;
