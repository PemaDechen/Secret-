//jshint esversion:6
require('dotenv').config();//to secretkey
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
mongoose.connect("mongodb://localhost:27017/user", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
// const userSchema={email:String,password:String};
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
//Done for encryption translating from js object to object of mongoose

userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ["password"]
})

const Users = new mongoose.model("User", userSchema);



app.get("/", (req, res) => {
  res.render("home")
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/secret", (req, res) => {
  res.render("secrets")
});
app.post("/register", (req, res) => {
  const newUser = new Users({
    email: req.body.username,
    password: req.body.password
  });
  console.log(req.body.password);
  newUser.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  Users.findOne({
    email: username
  }, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password)
        console.log(foundUser.password);
          res.render("secrets");
        }
      }
    })
  });

app.listen(30000, () => {
  console.log("Running at port 3000");
})
