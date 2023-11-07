const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const users = require("./routes/users");
const posts = require("./routes/posts");
const comments = require("./routes/comments");
const images = require("./routes/images");
const config = require("config");

const app = express();

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

app.use(cors());

app.use(express.json());

app.use("/uploads", express.static("uploads"));
app.use("/upload", images);
app.use("/api/user", users);
app.use("/api/posts", posts);
app.use("/api/comment", comments);

mongoose.connect("mongodb://127.0.0.1/posts");

var myHeaders = new Headers();
myHeaders.append("Access-Control-Allow-Origin", "http://localhost:3000");

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));
