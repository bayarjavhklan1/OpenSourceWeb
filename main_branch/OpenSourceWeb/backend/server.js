require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
// 서버 시작하는 파일
var express = require("express");
var mongoose = require("mongoose");
var cors = require("cors");
var path = require("path");

// 라우터들
var authRoute = require("./routes/auth.js");
var actRoute = require("./routes/activity.js");
var chatRoute = require("./routes/chat.js");
var adminRoute = require("./routes/admin.js");
var translateRoute = require("./routes/translate.js");//add

var app = express();

app.use(cors());
app.use(express.json()); // cors 다음에 json (순서 중요함)
app.use("/translate", translateRoute); //add

// public 폴더 정적파일 (admin.html 같은거)
app.use(express.static(path.join(__dirname, "public")));

// db 연결
mongoose
.connect(process.env.MONGO_URI)
  .then(function () {
    console.log("Connected to MongoDB database");
  })
  .catch(function (err) {
    console.log("db 연결 실패..", err);
  });

app.use("/auth", authRoute);
app.use("/activities", actRoute);
app.use("/chat", chatRoute);
app.use("/admin", adminRoute);

app.listen(5001, function () {
  console.log("Server is running on port 5001");
  console.log("admin page : http://localhost:5001/admin.html");
});
