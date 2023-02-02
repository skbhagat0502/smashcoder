const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const multer = require("multer");
const app = express();
const mongoose = require("mongoose");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.set("strictQuery", true);

mongoose.connect("mongodb://127.0.0.1:27017/youtubeDB", { useNewUrlParser: true, useUnifiedTopology: true });

const youtubeSchema = new mongoose.Schema({
  thumbnail: { data: Buffer, contentType: String },
  heading: String,
  description: String
});

const youtube = mongoose.model("youtube", youtubeSchema);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/Images")
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

app.get("/", function (request, response) {
  youtube.find({}, (err, posts) => {
    if (err) {
      console.log(err);
      response.status(500).send('An error occurred', err);
    }
    else {
      response.render("home", { posts: posts });
    }
  });
});
app.get("/home", function (request, response) {
  youtube.find({}, (err, posts) => {
    if (err) {
      console.log(err);
      response.status(500).send('An error occurred', err);
    }
    else {
      response.render("home", { posts: posts });
    }
  });
});
app.get("/about", function (request, response) {
  response.render("about");
});
app.get("/blogs", function (request, response) {
  response.render("blogs");
});
app.get("/contact", function (request, response) {
  response.render("contact");
});
app.get("/compose", function (request, response) {
  response.render("compose");
});

app.post("/compose", upload.single("thumbnail"), function (request, response) {
  var obj = {
    thumbnail: {
      data: request.file.filename,
      contentType: 'image/png'
    },
    heading: request.body.heading,
    description: request.body.description
  }
  youtube.create(obj, (err, item) => {
    if (err) {
      console.log(err);
    }
    else {
      item.save();
      response.redirect('/');
    }
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
