const { Post, validate } = require("../models/post");
const express = require("express");

const router = express.Router();

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

module.exports = router;
