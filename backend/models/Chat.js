import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  chat_room: { type: String, required: true }, // 방 이름 
  sender_name: { type: String, required: true }, // 사용자 
  message_text: { type: String, required: true }, // 내용 
  created_at: { type: Date, default: Date.now } // 시간 
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
