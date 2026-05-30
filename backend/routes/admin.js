import express from 'express';
import User from '../models/User.js';
import Activity from '../models/Activity.js';

var router = express.Router();

// 유저 목록 조회 (이름/이메일 검색 가능)
router.get('/users', function(req, res) {
  var keyword = req.query.keyword || '';
  var query = {};

  if (keyword) {
    query = {
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } }
      ]
    };
  }

  var users =  User.find(query).select('-password').sort({ createdAt: -1 });
  res.json({ success: true, data: users });
});

// 유저 삭제
router.delete('/users/:id',  function(req, res) {
  var user =  User.findById(req.params.id);
  if (!user) {
    return res.json({ success: false, message: '유저를 찾을 수 없어요' });
  }

   User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: '유저 삭제 완료' });
});

// 유저 관리자 승격
router.post('/users/:id/promote',  function(req, res) {
  var user =  User.findById(req.params.id);
  if (!user) {
    return res.json({ success: false, message: '유저를 찾을 수 없어요' });
  }

  if (user.role === 'admin') {
    return res.json({ success: false, message: '이미 관리자' });
  }

  user.role = 'admin';
  user.save();
  res.json({ success: true, message: '관리자로 승격' });
});

// 유저 일반으로 강등
router.post('/users/:id/demote',  function(req, res) {
  var user =  User.findById(req.params.id);
  if (!user) {
    return res.json({ success: false, message: '유저를 찾을 수 없음' });
  }

  if (user.role === 'user') {
    return res.json({ success: false, message: '이미 유저임' });
  }

  user.role = 'user';
   user.save();
  res.json({ success: true, message: '일반 유저로 변경' });
});



export default router;
