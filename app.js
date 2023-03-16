require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});


const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/logout", function (req, res) {
  res.redirect("/");
});

app.post("/register", function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password),
  });

  (async () => {
    try {
      await newUser
        .save()

        .then(function () {
          res.render("secrets");
          console.log("Secrets");
        });
      console.log("Successful save");
    } catch (error) {
      console.log(error);
    }
  })();

  // res.send("Register successful");
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = md5(req.body.password);

  (async () => {
    try {
      await User.findOne({ email: username }).then(function (foundUser) {
        if (foundUser) {
          if (foundUser.password === password) {
            res.render("secrets");
          } else {
            res.send("Failed to login. Please try again");
          }
        } else {
          res.send(
            "No username found with this email address. Please Register a new account"
          );
        }
      });
    } catch (erorr) {
      console.log(erorr);
    }
  })();
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
