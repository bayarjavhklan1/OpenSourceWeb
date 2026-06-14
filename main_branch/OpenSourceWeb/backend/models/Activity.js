const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: {
    name: String,
    avatar: String,
  },
  text: String,
  time: { type: Date, default: Date.now },
  replies: [
    {
      user: { name: String, avatar: String },
      text: String,
      time: { type: Date, default: Date.now },
    },
  ],
});

const memberSchema = new mongoose.Schema({
  name: String,
  avatar: String,
  country: String,
});

const activitySchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  location: String,
  address: String,
  date: String,
  time: String,
  duration: String,
  participants: { type: Number, default: 0 },
  maxParticipants: Number,
  image: String,
  createdAt: { type: Date, default: Date.now },
  organizer: { name: String, avatar: String, bio: String },
  comments: [commentSchema],
  members: [memberSchema],
});
module.exports = mongoose.model("Activity", activitySchema);
