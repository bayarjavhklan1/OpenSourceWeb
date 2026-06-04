import express from 'express';
import { 
  getConversations, 
  getMessages, 
  sendMessage, 
  createOrGetChat 
} from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getConversations)
  .post(protect, createOrGetChat);

router.route('/:id/messages')
  .get(protect, getMessages)
  .post(protect, sendMessage);

export default router;
