import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

// @desc    Get all conversations for a user
// @route   GET /api/chats
// @access  Private
export const getConversations = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user.id })
      .populate('participants', 'name avatar')
      .populate({
        path: 'lastMessage',
        select: 'text createdAt sender isRead'
      })
      .sort({ updatedAt: -1 });

    res.json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get messages for a specific chat
// @route   GET /api/chats/:id/messages
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat || !chat.participants.includes(req.user.id)) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    const messages = await Message.find({ chatId: req.params.id })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });

    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send a message
// @route   POST /api/chats/:id/messages
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const chatId = req.params.id;

    const chat = await Chat.findById(chatId);

    if (!chat || !chat.participants.includes(req.user.id)) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    const message = await Message.create({
      chatId,
      sender: req.user.id,
      text
    });

    // Update the last message of the chat
    chat.lastMessage = message._id;
    await chat.save();

    await message.populate('sender', 'name avatar');

    res.status(201).json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create or get existing 1-on-1 chat
// @route   POST /api/chats
// @access  Private
export const createOrGetChat = async (req, res) => {
  try {
    const { targetUserId } = req.body;

    if (!targetUserId) {
      return res.status(400).json({ success: false, message: 'Target user ID is required' });
    }

    // Find if a 1-on-1 chat already exists
    let chat = await Chat.findOne({
      isGroup: false,
      participants: { $all: [req.user.id, targetUserId] }
    }).populate('participants', 'name avatar');

    if (chat) {
      return res.json({ success: true, chat });
    }

    // Create a new one
    chat = await Chat.create({
      participants: [req.user.id, targetUserId],
      isGroup: false
    });

    chat = await chat.populate('participants', 'name avatar');

    res.status(201).json({ success: true, chat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
