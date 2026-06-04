var express = require("express");
var User = require("../models/User.js");
var Activity = require("../models/Activity.js");

var router = express.Router();

// 회원 

// 회원목록 (이름/이메일 검색됨)
router.get("/users", function(req, res) {
  var kw = req.query.keyword || "";
  var cond = {};

  if (kw) {
    // name 이나 email 에 검색어 들어간거 찾기 (LIKE '%kw%')
    cond = { $or: [
      { name: { $regex: kw, $options: "i" } },
      { email: { $regex: kw, $options: "i" } }
    ] };
  }

  // 비번빼고 가져오기, 최신가입순(-1)
  User.find(cond).select("-password").sort({ createdAt: -1 }).then(function(arr) {
    res.json({ success: true, data: arr });
  });
});

// 회원삭제
router.post("/users/:id/delete", function(req, res) {
  User.findById(req.params.id).then(function(user) {
    if (!user) return res.json({ success: false, message: "유저를 찾을 수 없어요" });
    // DELETE FROM users WHERE _id=?
    User.findByIdAndDelete(req.params.id).then(function() {
      res.json({ success: true, message: "유저 삭제 완료" });
    });
  });
});

// 관리자로 올리기
router.post("/users/:id/promote", function(req, res) {
  User.findById(req.params.id).then(function(user) {
    if (!user) return res.json({ success: false, message: "유저를 찾을 수 없어요" });
    if (user.role === "admin") return res.json({ success: false, message: "이미 관리자" });
    user.role = "admin";
    user.save().then(function() {
      res.json({ success: true, message: "관리자로 승격" });
    });
  });
});

// 일반으로 내리기
router.post("/users/:id/demote", function(req, res) {
  User.findById(req.params.id).then(function(user) {
    if (!user) return res.json({ success: false, message: "유저를 찾을 수 없음" });
    if (user.role === "user") return res.json({ success: false, message: "이미 유저임" });
    user.role = "user";
    user.save().then(function() {
      res.json({ success: true, message: "일반 유저로 변경" });
    });
  });
});

// ===== 모임 =====

router.get("/activities", function(req, res) {
  var kw = req.query.keyword || "";
  var cond = {};

  if (kw) {
    cond = { $or: [
      { title: { $regex: kw, $options: "i" } },
      { category: { $regex: kw, $options: "i" } },
      { location: { $regex: kw, $options: "i" } }
    ] };
  }

  Activity.find(cond).sort({ createdAt: -1 }).then(function(arr) {
    res.json({ success: true, data: arr });
  });
});

// 모임삭제
router.post("/activities/:id/delete", function(req, res) {
  Activity.findById(req.params.id).then(function(act) {
    if (!act) return res.json({ success: false, message: "모임을 찾을 수 없어요" });
    Activity.findByIdAndDelete(req.params.id).then(function() {
      res.json({ success: true, message: "모임 삭제 완료" });
    });
  });
});

// 모임수정
router.post("/activities/:id/update", function(req, res) {
  Activity.findById(req.params.id).then(function(act) {
    if (!act) return res.json({ success: false, message: "모임을 찾을 수 없어요" });

    var b = req.body;
    if (!b.title || !b.category || !b.location || !b.date || !b.time || !b.maxParticipants) {
      return res.json({ success: false, message: "필수 항목을 입력해주세요" });
    }

    act.title = b.title;
    act.category = b.category;
    act.description = b.description || "";
    act.location = b.location;
    act.address = b.address || "";
    act.date = b.date;
    act.time = b.time;
    act.duration = b.duration || "";
    act.maxParticipants = Number(b.maxParticipants);

    // UPDATE activities SET ... WHERE _id=?
    act.save().then(function() {
      res.json({ success: true, message: "모임 수정 완료", data: act });
    });
  });
});

module.exports = router;
