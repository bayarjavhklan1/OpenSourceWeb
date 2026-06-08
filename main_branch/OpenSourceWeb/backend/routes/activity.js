var express = require("express");
var Activity = require("../models/Activity.js");

var router = express.Router();

// 모임 전체목록  (SELECT * FROM activities)
router.get("/", function(req, res) {
  Activity.find()
  .then(function(list) {
    res.json(list);
  });
});

// 모임 하나  (SELECT * FROM activities WHERE _id = ?)
router.get("/:id", function(req, res) {
  Activity.findById(req.params.id)
  .then(function(item) {
    if (!item) return res.json({ success: false, message: "없는 모임이에요" });
    res.json(item);
  });
});

// 모임 등록
router.post("/", function(req, res) {
  var b = req.body;

  if (!b.title || !b.category || !b.location || !b.date || !b.time || !b.maxParticipants) {
    return res.json({ success: false, message: "필수 항목을 입력해주세요" });
  }

  var newAct = new Activity({ // models에서 스키마 보고 참고 
    title: b.title,
     category: b.category, 
     description: b.description,
    location: b.location, 
    address: b.address, 
    date: b.date,
     time: b.time,
    duration: b.duration, 
    maxParticipants: b.maxParticipants,
    image: b.image, 
    organizer: b.organizer
  });

  // INSERT INTO activities (...) VALUES (...)
  newAct.save()
  .then(function() {
    res.json({ success: true, message: "모임 등록 완료", data: newAct });
  });
});

module.exports = router;
