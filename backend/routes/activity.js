import express from 'express';
import Activity from '../models/Activity.js';

var router = express.Router();

// 모임 전체 목록 가져오기
router.get('/', async function(req, res) {
  var list = await Activity.find();
  res.json(list);
});

// 모임 하나 가져오기
router.get('/:id', async function(req, res) {
  var item = await Activity.findById(req.params.id);
  if (!item) {
    return res.json({ success: false, message: '없는 모임이에요' });
  }
  res.json(item);
});

// 모임 등록
router.post('/', async function(req, res) {
  var body = req.body;

  if (!body.title || !body.category || !body.location || !body.date || !body.time || !body.maxParticipants) {
    return res.json({ success: false, message: '필수 항목을 입력해주세요' });
  }

  var newActivity = new Activity({
    title: body.title,
    category: body.category,
    description: body.description,
    location: body.location,
    address: body.address,
    date: body.date,
    time: body.time,
    duration: body.duration,
    maxParticipants: body.maxParticipants,
    image: body.image,
    organizer: body.organizer
  });

  await newActivity.save();
  res.json({ success: true, message: '모임 등록 완료', data: newActivity });
});

export default router;
