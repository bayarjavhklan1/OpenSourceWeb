require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

var express = require("express");
var mongoose = require("mongoose");
var cors = require("cors");
var path = require("path");
const fs = require("fs");
const uploadRoute = require("./routes/upload.js");

var authRoute = require("./routes/auth.js");
var actRoute = require("./routes/activity.js");
var chatRoute = require("./routes/chat.js");
var adminRoute = require("./routes/admin.js");
var translateRoute = require("./routes/translate.js");

var app = express();

app.use(cors());
app.use(express.json());
app.use("/translate", translateRoute);

app.use(express.static(path.join(__dirname, "public")));

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}
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
app.use("/uploads", express.static("uploads"));
app.use("/upload", uploadRoute);
app.use("/users", require("./routes/users.js"));

app.listen(5001, function () {
  console.log("Server is running on port 5001");
  console.log("admin page : http://localhost:5001/admin.html");
});
