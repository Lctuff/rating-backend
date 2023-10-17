const express = require("express");
const mongoose = require("mongoose");

const posts = require("./routes/posts");

const app = express();

app.use(express.json());

app.use("/api/posts", posts);

mongoose.connect("mongodb://127.0.0.1/posts");

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));
