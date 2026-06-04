import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '👩' },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  interests: [{ type: String }],
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  activitiesJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export default mongoose.model('User', userSchema);
