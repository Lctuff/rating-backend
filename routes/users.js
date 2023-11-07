const _ = require("lodash");
const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const { User, validate } = require("../models/users");
const Joi = require("joi");
const { Post } = require("../models/post");
const { Comment } = require("../models/comments");
const config = require("config");

const router = express.Router();

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");

  const createUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    profileImg: "http://localhost:3001/uploads/2oxukrvp.png",
  };

  user = new User(
    _.pick(createUser, ["name", "email", "password", "profileImg"])
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImg: user.profileImg,
      admin: user.admin,
    },
    config.get("jwtPrivateKey")
  );
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "name", "email"]));
});
router.post("/auth", async (req, res) => {
  const { error } = validateAuth(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  const token = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImg: user.profileImg,
      admin: user.admin,
    },
    config.get("jwtPrivateKey")
  );
  res.send(token);
});

router.delete("/:id", auth, async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  await Post.deleteMany({ user: { _id: req.params.id } });
  await Comment.deleteMany({ user: { _id: req.params.id } });

  res.send(user);
});

router.put("/:id", auth, async (req, res) => {
  let checkPass = await User.findOne({ email: req.body.email });
  if (!checkPass) return res.status(400).send("Invalid email");

  if (checkPass.email !== req.body.email) {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered");
  }

  const validPassword = await bcrypt.compare(
    req.body.password,
    checkPass.password
  );
  if (!validPassword) return res.status(400).send("Invalid password");
  console.log(req.body);

  const salt = await bcrypt.genSalt(10);
  req.body.confirmPassword = await bcrypt.hash(req.body.confirmPassword, salt);

  const user = await User.findByIdAndUpdate(req.params.id, {
    $set: {
      name: req.body.name,
      email: req.body.email,
      password: req.body.confirmPassword,
      profileImg: req.body.profileImg,
    },
  });

  const token = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImg: user.profileImg,
      admin: user.admin,
    },
    config.get("jwtPrivateKey")
  );
  res.send(token);
});

function validateAuth(req) {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });
  return schema.validate(req);
}

module.exports = router;
