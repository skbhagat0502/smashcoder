const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const multer = require("multer");
const app = express();
const mongoose = require("mongoose");
const { marked } = require("marked");
const slugify = require("slugify");
const creatDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = creatDomPurify(new JSDOM().window);
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.set("strictQuery", true);

mongoose.connect(
  "mongodb+srv://pandadeveloperofficial:i0UYDy2WqJ0kMLoF@smashcodercluster.mrewaud.mongodb.net/SmashDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const youtubeSchema = new mongoose.Schema({
  thumbnail: { data: Buffer, contentType: String },
  heading: String,
  description: String,
  link: String,
});

const blogSchema = new mongoose.Schema({
  title: String,
  createdAt: { type: Date, default: Date.now },
  description: String,
  markdown: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  sanitizedHtml: { type: String, required: true },
});

blogSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));
  }
  next();
});
const youtube = mongoose.model("youtube", youtubeSchema);
const blog = mongoose.model("blog", blogSchema);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/Images");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
  },
});
const storage1 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/imageblog");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
const upload1 = multer({ storage: storage1 });

app.get("/", function (request, response) {
  youtube.find({}, (err, posts) => {
    if (err) {
      console.log(err);
      response.status(500).send("An error occurred", err);
    } else {
      response.render("home", { posts: posts });
    }
  });
});
app.get("/home", function (request, response) {
  youtube.find({}, (err, posts) => {
    if (err) {
      console.log(err);
      response.status(500).send("An error occurred", err);
    } else {
      response.render("home", { posts: posts });
    }
  });
});

app.get("/blogs", function (request, response) {
  blog.find({}, function (err, blogs) {
    if (err) {
      console.log(err);
      response.status(500).send("An error occurred", err);
    } else {
      response.render("blogs", { blogs: blogs });
    }
  });
});
app.get("/blogs/:slug", function (request, response) {
  blog.findOne({ slug: request.params.slug }, function (err, blogs) {
    if (blogs) {
      response.render("posts", { blogs: blogs });
    } else {
      response.send("<h1>File does not Exist.</h1>");
    }
  });
});
app.get("/contact", function (request, response) {
  response.render("contact");
});
app.get("/composeyt", function (request, response) {
  response.render("composeyoutubepost");
});
app.get("/composeblogs", function (request, response) {
  response.render("composeblogs");
});

app.post(
  "/composeyt",
  upload.single("thumbnail"),
  function (request, response) {
    var obj = {
      thumbnail: {
        data: request.file.filename,
        contentType: "image/png",
      },
      heading: request.body.heading,
      description: request.body.description,
      link: request.body.link,
    };
    youtube.create(obj, (err, item) => {
      if (err) {
        console.log(err);
      } else {
        item.save();
        response.redirect("/");
      }
    });
  }
);
app.post(
  "/composeblogs",
  upload1.array("image", 50),
  function (request, response) {
    var obj = {
      image: {
        data: request.files.filename,
        contentType: "image/png",
      },
      title: request.body.title,
      date: request.body.date,
      description: request.body.description,
      markdown: request.body.markdown,
    };
    blog.create(obj, (err, item) => {
      if (err) {
        console.log(err);
      } else {
        item.save();
        response.redirect("blogs");
      }
    });
  }
);
app.listen(3000);
