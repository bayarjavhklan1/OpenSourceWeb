import express from 'express';
import { 
  getActivities, 
  getActivityById, 
  createActivity, 
  joinActivity, 
  leaveActivity, 
  addComment 
} from '../controllers/activityController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getActivities)
  .post(protect, createActivity);

router.route('/:id')
  .get(getActivityById);

router.post('/:id/join', protect, joinActivity);
router.post('/:id/leave', protect, leaveActivity);
router.post('/:id/comment', protect, addComment);

export default router;
