var express = require("express");
var Activity = require("../models/Activity.js");

var router = express.Router();

// 모임 전체목록
router.get("/", function (req, res) {
  Activity.find().then(function (list) {
    res.json(list);
  });
});

// 모임 하나
router.get("/:id", function (req, res) {
  Activity.findById(req.params.id).then(function (item) {
    if (!item) return res.json({ success: false, message: "없는 모임이에요" });
    res.json(item);
  });
});

// 모임 등록
router.post("/", function (req, res) {
  var b = req.body;

  if (
    !b.title ||
    !b.category ||
    !b.location ||
    !b.date ||
    !b.time ||
    !b.maxParticipants
  ) {
    return res.json({ success: false, message: "필수 항목을 입력해주세요" });
  }

  var newAct = new Activity({
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
    organizer: b.organizer,
  });

  newAct
    .save()
    .then(function () {
      res.json({ success: true, message: "모임 등록 완료", data: newAct });
    })
    .catch(function (err) {
      res
        .status(500)
        .json({ success: false, message: "저장 실패", error: err.message });
    });
});

// Join / Leave
router.post("/:id/join", function (req, res) {
  var { member, action } = req.body;

  Activity.findById(req.params.id)
    .then(function (item) {
      if (!item)
        return res
          .status(404)
          .json({ success: false, message: "없는 모임이에요" });

      if (action === "join") {
        if (item.participants >= item.maxParticipants) {
          return res.json({ success: false, message: "정원이 가득 찼어요" });
        }
        item.members.push(member);
        item.participants += 1;
      } else if (action === "leave") {
        item.members = item.members.filter(function (m) {
          return m.name !== member.name;
        });
        item.participants = Math.max(0, item.participants - 1);
      }

      item.save().then(function () {
        res.json(item);
      });
    })
    .catch(function (err) {
      res.status(500).json({ success: false, error: err.message });
    });
});

router.post("/:id/comments", function (req, res) {
  var { user, text } = req.body;

  if (!text || !text.trim()) {
    return res.json({ success: false, message: "댓글 내용을 입력해주세요" });
  }

  Activity.findById(req.params.id)
    .then(function (item) {
      if (!item)
        return res
          .status(404)
          .json({ success: false, message: "없는 모임이에요" });

      item.comments.push({ user: user, text: text });

      item.save().then(function () {
        res.json(item.comments);
      });
    })
    .catch(function (err) {
      res.status(500).json({ success: false, error: err.message });
    });
});

module.exports = router;
