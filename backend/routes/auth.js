import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

var router = express.Router();

router.post('/register', function(req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var adminCode = req.body.adminCode;

  if (!name || !email || !password) {
    return res.json({ success: false, message: '빠진 항목이 있어요' });
  }

  User.findOne({ email: email })
  .then(function(Check) {
    if (Check) {
      return res.json({ success: false, message: '이미 있는 이메일이에요' });
    }

    bcrypt.hash(password, 10).then(function(pw) {
      var role = 'user';
      if (adminCode === 'ADMIN1234') {
        role = 'admin';
      }

      var user = new User({ name: name, email: email, password: pw, role: role });
      user.save()
      .then(function() {
        res.json({ success: true, message: '회원가입 완료', user: { name: user.name, email: user.email, role: user.role } });
      });
    });
  });
});



router.post('/login', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;

  if (!email || !password) {
    return res.json({ success: false, message: '이메일이랑 비밀번호 입력하세요' });
  }

  User.findOne({ email: email })
  .then(function(user) {
    if (!user) {
      return res.json({ success: false, message: '없는 이메일이에요' });
    }

    bcrypt.compare(password, user.password)
    .then(function(pwCheck) {
      if (!pwCheck) {
        return res.json({ success: false, message: '비밀번호 틀렸어요' });
      }

      res.json({
        success: true,
        message: '로그인 성공',
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    });
  });
});


export default router;
