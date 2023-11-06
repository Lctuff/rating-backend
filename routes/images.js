const express = require("express");

const router = express.Router();

const multer = require("multer");
const auth = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads");
  },
  filename: function (req, file, callback) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    callback(null, file.fieldname + "-" + uniqueSuffix + ".png");
  },
});

const upload = multer({ storage: storage });
router.post("/", auth, upload.single("files"), uploadFiles);

function uploadFiles(req, res) {
  console.log(req.body);
  console.log(req.file);

  const filePath = "http://localhost:3001/uploads/" + req.file.filename;

  res.send(filePath);
}

module.exports = router;
