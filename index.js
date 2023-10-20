const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const users = require("./routes/users");
const posts = require("./routes/posts");
const comments = require("./routes/comments");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/user", users);
app.use("/api/posts", posts);
app.use("/api/comment", comments);

mongoose.connect("mongodb://127.0.0.1/posts");

var myHeaders = new Headers();
myHeaders.append("Access-Control-Allow-Origin", "http://localhost:3000");

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));
