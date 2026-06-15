var express = require("express");
var Chat = require("../models/Chat.js");

var router = express.Router();

// 메시지 보내기
router.post("/send", function (req, res) {
  var msg = new Chat({
    chat_room: req.body.chat_room,
    sender_name: req.body.sender_name,
    message_text: req.body.message_text,
  });

  msg.save().then(function () {
    res.json({ success: true });
  });
});

router.get("/messages", function (req, res) {
  var room = req.query.room;
  var lastId = req.query.lastId;

  var cond = { chat_room: room };
  if (lastId) {
    cond._id = { $gt: lastId }; // _id 가 lastId 보다 큰거 = 그 이후 새 메시지만
  }
  // SELECT * FROM chats WHERE chat_room=? [AND _id>?] ORDER BY created_at ASC
  Chat.find(cond)
    .sort({ created_at: 1 })
    .then(function (arr) {
      res.json(arr);
    });
});

router.get("/rooms", function (req, res) {
  Chat.aggregate([
    { $sort: { created_at: -1 } },
    {
      $group: {
        _id: "$chat_room",
        lastMessage: { $first: "$message_text" },
        lastTime: { $first: "$created_at" },
        lastSender: { $first: "$sender_name" },
        participants: { $addToSet: "$sender_name" },
      },
    },
    { $sort: { lastTime: -1 } },
  ]).then(function (rooms) {
    res.json(rooms);
  });
});

module.exports = router;
