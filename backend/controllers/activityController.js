import Activity from '../models/Activity.js';
import User from '../models/User.js';

// @desc    Get all activities
// @route   GET /api/activities
// @access  Public
export const getActivities = async (req, res) => {
  try {
    const query = {};
    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { location: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const activities = await Activity.find(query)
      .populate('organizer', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, activities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get activity by ID
// @route   GET /api/activities/:id
// @access  Public
export const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate('organizer', 'name avatar bio')
      .populate('participants', 'name avatar location')
      .populate('comments.user', 'name avatar')
      .populate('comments.replies.user', 'name avatar');

    if (activity) {
      res.json({ success: true, activity });
    } else {
      res.status(404).json({ success: false, message: 'Activity not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create an activity
// @route   POST /api/activities
// @access  Private
export const createActivity = async (req, res) => {
  try {
    const { title, category, description, location, address, date, time, duration, maxParticipants, image } = req.body;

    const activity = await Activity.create({
      title,
      category,
      description,
      location,
      address,
      date,
      time,
      duration,
      maxParticipants,
      image,
      organizer: req.user.id,
      participants: [req.user.id] // Organizer is initially joined
    });

    // Also update User's activitiesJoined
    await User.findByIdAndUpdate(req.user.id, { $push: { activitiesJoined: activity._id } });

    res.status(201).json({ success: true, activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Join an activity
// @route   POST /api/activities/:id/join
// @access  Private
export const joinActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (activity) {
      if (activity.participants.includes(req.user.id)) {
        return res.status(400).json({ success: false, message: 'Already joined this activity' });
      }

      if (activity.participants.length >= activity.maxParticipants) {
        return res.status(400).json({ success: false, message: 'Activity is full' });
      }

      activity.participants.push(req.user.id);
      await activity.save();

      await User.findByIdAndUpdate(req.user.id, { $push: { activitiesJoined: activity._id } });

      res.json({ success: true, message: 'Joined activity successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Activity not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Leave an activity
// @route   POST /api/activities/:id/leave
// @access  Private
export const leaveActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (activity) {
      if (!activity.participants.includes(req.user.id)) {
        return res.status(400).json({ success: false, message: 'Not joined this activity' });
      }

      activity.participants = activity.participants.filter(p => p.toString() !== req.user.id);
      await activity.save();

      await User.findByIdAndUpdate(req.user.id, { $pull: { activitiesJoined: activity._id } });

      res.json({ success: true, message: 'Left activity successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Activity not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add comment to activity
// @route   POST /api/activities/:id/comment
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const activity = await Activity.findById(req.params.id);

    if (activity) {
      const comment = {
        user: req.user.id,
        text
      };

      activity.comments.push(comment);
      await activity.save();

      res.status(201).json({ success: true, message: 'Comment added' });
    } else {
      res.status(404).json({ success: false, message: 'Activity not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
