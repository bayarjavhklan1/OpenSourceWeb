const Subscriber = require("../models/Subscriber");

// POST /api/subscribers - Add a new subscriber
const addSubscriber = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if email already exists
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "This email is already subscribed" });
    }

    // Create new subscriber
    const newSubscriber = await Subscriber.create({ email });

    res.status(201).json({
      message: "Successfully subscribed! 🎉",
      subscriber: newSubscriber,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/subscribers/count - Get total subscriber count
const getSubscriberCount = async (req, res) => {
  try {
    const count = await Subscriber.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addSubscriber, getSubscriberCount };