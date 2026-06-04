import User from '../models/User.js';
import Activity from '../models/Activity.js';

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Public
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('activitiesJoined', 'title date image category location')
      .populate('followers', 'name avatar')
      .populate('following', 'name avatar');

    if (user) {
      const activitiesOrganized = await Activity.countDocuments({ organizer: req.params.id });

      const stats = {
        activitiesJoined: user.activitiesJoined.length,
        activitiesOrganized,
        followers: user.followers.length,
        following: user.following.length
      };

      res.json({ success: true, user: { ...user.toObject(), stats } });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.location = req.body.location !== undefined ? req.body.location : user.location;
      user.avatar = req.body.avatar || user.avatar;
      
      if (req.body.interests) {
        user.interests = Array.isArray(req.body.interests) ? req.body.interests : req.body.interests.split(',');
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          avatar: updatedUser.avatar,
          bio: updatedUser.bio,
          location: updatedUser.location,
          interests: updatedUser.interests,
        },
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
