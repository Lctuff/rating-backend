const validateObjectId = require("../middleware/validateObjectId");
const { Comment } = require("../models/comments");
const { Post } = require("../models/post");
const express = require("express");

const router = express.Router();

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

module.exports = router;
