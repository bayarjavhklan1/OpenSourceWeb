var express = require("express");
var bcrypt = require("bcryptjs");
var User = require("../models/User.js");

var router = express.Router();

// 회원가입
router.post("/register", function(req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var pw = req.body.password;
  var code = req.body.adminCode;

  if (!name || !email || !pw) {
    return res.json({ success: false, message: "빠진 항목이 있어요" });
  }

  // 이메일 중복확인  (SELECT * FROM users WHERE email = ?)
  User.findOne({ email: email })
  .then(function(same) {
    if (same) {
      return res.json({ success:false, message: "이미 있는 이메일이에요" });
    }

    // 비번은 그대로 저장 안하고 암호로 바꿔서 저장함
    bcrypt.hash(pw, 10)
    .then(function(hashPw) {
      var role = "user";
      if (code === "ADMIN1234") role = "admin";

      var newUser = new User({ name: name, email: email, password: hashPw, role: role });

      // INSERT INTO users (...) VALUES (...)
      newUser.save() // 저장 
      .then(function() {
        res.json({ success: true, message: "회원가입 완료", user: { name: newUser.name, email: newUser.email, role: newUser.role } });
      });
    });
  });
});

// 로그인
router.post("/login", function(req, res) {
  var email = req.body.email;
  var pw = req.body.password;

  if (!email || !pw) {
    return res.json({ success: false, message: "이메일이랑 비밀번호 입력하세요" });
  }

  User.findOne({ email: email })
  .then(function(user) {
    if (!user) {
      return res.json({ success: false, message: "없는 이메일이에요" });
    }

    // 입력한 비번이랑 저장된 암호 비교 (맞는지만 확인)
    bcrypt.compare(pw, user.password)
    .then(function(ok) {
      if (!ok) {
        return res.json({ success: false, message: "비밀번호 틀렸어요" });
      }
      res.json({ success: true, message: "로그인 성공", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    });
  });
});

module.exports = router;
