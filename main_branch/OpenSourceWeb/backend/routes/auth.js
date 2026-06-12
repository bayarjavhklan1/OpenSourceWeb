var express = require("express");
var bcrypt = require("bcryptjs");
var User = require("../models/User.js");
var router = express.Router();

// Register endpoint
router.post("/register", function (req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var pw = req.body.password;
  var code = req.body.code;

  if (!name || !email || !pw) {
    return res.json({ success: false, message: "All fields are required" });
  }

  User.findOne({ email: email }).then(function (same) {
    if (same) {
      return res.json({ success: false, message: "Email already exists" });
    }

    bcrypt.hash(pw, 10).then(function (hashPw) {
      var role = "user";
      if (code === "ADMIN1234") role = "admin";

      var newUser = new User({
        name: name,
        email: email,
        password: hashPw,
        role: role,
        bio: req.body.bio || "",
        location: req.body.location || "",
        avatar: req.body.avatar || "👤",
        interests: req.body.interests || [],
      });

      newUser.save().then(function () {
        res.json({
          success: true,
          user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            avatar: newUser.avatar,
            location: newUser.location,
            interests: newUser.interests,
          },
        });
      });
    });
  });
});

// Login endpoint
router.post("/login", function (req, res) {
  var email = req.body.email;
  var pw = req.body.password;

  if (!email || !pw) {
    return res.json({
      success: false,
      message: "Email and password are required",
    });
  }

  User.findOne({ email: email }).then(function (user) {
    if (!user) {
      return res.json({ success: false, message: "Email not found" });
    }

    bcrypt.compare(pw, user.password).then(function (ok) {
      if (!ok) {
        return res.json({ success: false, message: "Wrong password" });
      }

      res.json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    });
  });
});

module.exports = router;