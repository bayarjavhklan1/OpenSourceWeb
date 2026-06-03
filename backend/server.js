import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import authRouter from './routes/auth.js';
import activityRouter from './routes/activity.js';
import chatRouter from './routes/chat.js';
import adminRouter from './routes/admin.js';

var app = express();


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect('mongodb://localhost:27017/Open_Web_proj')
  .then(function() {
    console.log('MongoDB 연결 성공!');
  })
  .catch(function(err) {
    console.error('MongoDB 연결 실패:', err);
  });

app.use('/auth', authRouter);
app.use('/activities', activityRouter);
app.use('/chat', chatRouter);
app.use('/admin', adminRouter);

app.listen(5000, function() {
  console.log('서버 실행 중 : http://localhost:5000');
  console.log('관리자 페이지 : http://localhost:5000/admin.html');
});
