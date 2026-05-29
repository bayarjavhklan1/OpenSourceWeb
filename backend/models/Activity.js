import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, default: '' },
  location: { type: String, required: true },
  address: { type: String, default: '' },
  date: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: String, default: '' },
  participants: { type: Number, default: 0 },
  maxParticipants: { type: Number, required: true },
  image: { type: String, default: '' },
  organizer: {
    name: { type: String, default: '' },
    avatar: { type: String, default: '아이콘 넣기 ' }
  },
  createdAt: { type: Date, default: Date.now }
});

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
