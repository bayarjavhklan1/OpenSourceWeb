var express = require("express");
var User = require("../models/User.js");
var router = express.Router();

router.get("/:name", function (req, res) {
  User.findOne({ name: req.params.name }, { password: 0 }) // нууц үг явуулахгүй
    .then(function (user) {
      if (!user) return res.status(404).json({ error: "Олдсонгүй" });
      res.json(user);
    });
});

router.put("/:name", function (req, res) {
  User.findOneAndUpdate(
    { name: req.params.name },
    {
      $set: {
        bio: req.body.bio,
        location: req.body.location,
        interests: req.body.interests,
        avatar: req.body.avatar,
      },
    },
    { new: true, fields: { password: 0 } },
  ).then(function (user) {
    res.json(user);
  });
});

module.exports = router;
