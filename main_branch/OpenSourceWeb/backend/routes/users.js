var express = require("express");
var User = require("../models/User.js");

var router = express.Router();

router.get("/:name", function (req, res) {
  User.findOne({ name: req.params.name })
    .then(function (user) {
      if (!user) {
        return res.json({ success: false, message: "없는 사용자예요" });
      }
      res.json(user);
    })
    .catch(function (err) {
      res.status(500).json({ success: false, error: err.message });
    });
});

router.put("/:name", function (req, res) {
  var b = req.body;

  var update = {};
  if (b.bio !== undefined) update.bio = b.bio;
  if (b.location !== undefined) update.location = b.location;
  if (b.avatar !== undefined) update.avatar = b.avatar;
  if (b.interests !== undefined) update.interests = b.interests;

  User.findOneAndUpdate(
    { name: req.params.name },
    { $set: update },
    { new: true },
  )
    .then(function (user) {
      if (!user) {
        return res.json({ success: false, message: "없는 사용자예요" });
      }
      res.json(user);
    })
    .catch(function (err) {
      res.status(500).json({ success: false, error: err.message });
    });
});

module.exports = router;
