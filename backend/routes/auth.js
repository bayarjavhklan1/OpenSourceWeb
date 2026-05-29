import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

// 회원가입
router.post('/register', async function(req, res) {

  const { name, email, password, adminCode } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: '빠진 항목이 있어요' });
  }

  // 중복 이메일 체크
  const dupCheck = await User.findOne({ email });
  if (dupCheck) {
    return res.json({ success: false, message: '이미 있는 이메일이에요' });
  }

  const pw = await bcrypt.hash(password, 10);

  let role = 'user';
  if (adminCode === 'ADMIN1234') {
    role = 'admin';
  }

  const user = new User({ name, email, password: pw, role });
  await user.save();

  res.json({ success: true, message: '회원가입 완료', user: { name: user.name, email: user.email, role: user.role } });
});


// 로그인
router.post('/login', async function(req, res) {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: '이메일이랑 비밀번호 입력하세요' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ success: false, message: '없는 이메일이에요' });
  }

  // 비밀번호 맞는지 확인
  const pwCheck = await bcrypt.compare(password, user.password);
  if (!pwCheck) {
    return res.json({ success: false, message: '비밀번호 틀렸어요' });
  }

  res.json({
    success: true,
    message: '로그인 성공',
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
});


export default router;
