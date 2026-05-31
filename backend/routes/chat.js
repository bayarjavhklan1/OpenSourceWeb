import express from 'express';
import Chat from '../models/Chat.js';

var router = express.Router();

router.post('/send', function(req, res) {
  var msg = new Chat({
    chat_room: req.body.chat_room,
    sender_name: req.body.sender_name,
    message_text: req.body.message_text
  });

  msg.save()
  .then(function() {
    res.json({ success: true });
  });
});

router.get('/messages', function(req, res) {
  var room = req.query.room;
  var lastId = req.query.lastId;

  var query = { chat_room: room };
  if (lastId) {
    query._id = { $gt: lastId }; //_id > lastId (초과)
  }

  Chat.find(query).sort({ created_at: 1 })// 오름차순 정렬 
  .then(function(msgs) {
    res.json(msgs);
  });
});

export default router;
