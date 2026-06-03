require("dotenv").config();

var express = require("express");
var Anthropic = require("@anthropic-ai/sdk"); // AI 코드 
var Activity = require("../models/Activity.js");

var router = express.Router();
var ai = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// 모임 전체목록  (SELECT * FROM activities)
router.get("/", function(req, res) {
  Activity.find()
  .then(function(list) {
    res.json(list); //list 리턴해줌 
  }).catch(function(err) {
    console.log("activity list 빠꾸남 ㅠ.ㅠ:", err);
    res.json({ success: false, message: "목록이 없음" });
  });
});

// 모임 하나  (SELECT * FROM activities WHERE _id = ?)
router.get("/:id", function(req, res) {
  Activity.findById(req.params.id)
  .then(function(item) {
    if (!item) return res.json({ success: false, message: "없는 모임이에요" });
    res.json(item);
  }).catch(function(err) {
    console.log("activity 빠꾸남:", err);
    res.json({ success: false, message: "없는 모임이에요" });
  });
});

// 모임 등록
router.post("/", function(req, res) {
  var b = req.body;

  if (!b.title || !b.category || !b.location || !b.date || !b.time || !b.maxParticipants) {
    return res.json({ success: false, message: "필수 항목을 입력해라이이이이" });
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
    organizer: b.organizer
  });

  // INSERT INTO activities ~~ VALUES ~~
  newAct.save()
  .then(function() {
    res.json({ success: true, message: "모임 등록 완료", data: newAct });
  }).catch(function(err) {
    console.log("activity create error:", err);
    res.json({ success: false, message: "모임 등록 실패" });
  });
});

// AI 자동완성 - 한줄 힌트 주면 모임 내용 만들어줌
router.post("/ai-suggest", function(req, res) {
  var hint = req.body.hint || "";
  if (!hint.trim()) {
    return res.json({ success: false, message: "힌트를 입력해주세요" });
  }

  var ask = `당신은 유학생들의 모임 활동을 도와주는 agent입니다. 아래 힌트를 바탕으로 활동 게시글을 완성해주세요.

힌트: "${hint}"

카테고리 (정확히 하나만 선택): 같이 공부, 같이 밥먹기, 운동, 언어교환, 여행, 취미, 소셜 이벤트, 기타

규칙:
- title: 눈에 띄는 제목, 60자 이내
- description: 2~3문장으로 설명
- location: 동네 이름이나 랜드마크
- duration: 예시 "2시간"
- maxParticipants: 4~20 사이 숫자

JSON만 반환하고 마크다운 쓰지 마세요:
{"title":"...","category":"...","description":"...","location":"...","duration":"...","maxParticipants":8}`;

  ai.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 768,
    messages: [{ role: "user", content: ask }]
  }).then(function(r) {
    var obj = JSON.parse(r.content[0].text);
    res.json({ success: true, data: obj });
  }).catch(function(err) {
    console.log("ai-suggest error:", err);
    res.json({ success: false, message: "자동 시이일패" });
  });
});

module.exports = router;
