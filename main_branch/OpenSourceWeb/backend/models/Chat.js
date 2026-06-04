var mongoose = require("mongoose");

// 채팅 메시지 한개
var chatSchema = new mongoose.Schema({
  chat_room: { type: String, required: true },
  sender_name: { type: String, required: true },
  message_text: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

var Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
