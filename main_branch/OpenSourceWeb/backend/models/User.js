var mongoose = require("mongoose");

// users 컬렉션 (회원정보)
// SQL 로 치면 CREATE TABLE users (...) 같은 설계도
var userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  bio: { type: String, default: "" },
  location: { type: String, default: "" },
  avatar: { type: String, default: "🙂" },
  interests: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

var User = mongoose.model("User", userSchema);
module.exports = User;
