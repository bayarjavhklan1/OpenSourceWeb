// 예시데이터 넣는 파일 (비어있을때만 모임 6개 넣음)
// 실행: node seed.js
// 이건 예시 데이터 놓는 방식으로 사실 실행을 안해도 된다. 
var mongoose = require("mongoose");
var Activity = require("./models/Activity.js");

mongoose.connect("mongodb://localhost:27017/Open_Web_proj")
.then(function() {
  console.log("Connected to MongoDB database");
});

var samples = [
  {
    title: "Korean Language Exchange @ Cafe",
    category: "Language Exchange",
    description: "Join us for a relaxed Korean-English language exchange session at a cozy cafe in Hongdae!",
    location: "Hongdae, Seoul",
    address: "240-3 Donggyo-ro, Yeonnam-dong, Mapo-gu, Seoul",
    date: "May 15, 2026",
    time: "6:00 PM",
    duration: "2 hours",
    participants: 8,
    maxParticipants: 12,
    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786",
    organizer: { name: "Sarah Kim", avatar: "👩" }
  },
  {
    title: "Weekend Hiking to Bukhansan",
    category: "Travel",
    description: "A weekend morning hike to Bukhansan National Park.",
    location: "Bukhansan National Park",
    address: "",
    date: "May 17, 2026",
    time: "8:00 AM",
    duration: "4 hours",
    participants: 15,
    maxParticipants: 20,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    organizer: { name: "Mike Chen", avatar: "👨" }
  },
  {
    title: "Study Group - Midterm Prep",
    category: "Study Together",
    description: "Group study session for midterm preparation.",
    location: "University Library",
    address: "",
    date: "May 14, 2026",
    time: "2:00 PM",
    duration: "3 hours",
    participants: 6,
    maxParticipants: 8,
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
    organizer: { name: "Emma Lee", avatar: "👩" }
  },
  {
    title: "Thai Food Cooking Night",
    category: "Eat Together",
    description: "Cook and eat Thai food together at Itaewon Community Kitchen.",
    location: "Itaewon Community Kitchen",
    address: "",
    date: "May 16, 2026",
    time: "7:00 PM",
    duration: "2 hours",
    participants: 10,
    maxParticipants: 15,
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d",
    organizer: { name: "Alex Park", avatar: "👨" }
  },
  {
    title: "Morning Yoga in the Park",
    category: "Exercise",
    description: "Morning yoga session at Han River Park.",
    location: "Han River Park",
    address: "",
    date: "May 14, 2026",
    time: "7:00 AM",
    duration: "1 hour",
    participants: 12,
    maxParticipants: 20,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
    organizer: { name: "Julia Martinez", avatar: "👩" }
  },
  {
    title: "K-Pop Dance Cover Practice",
    category: "Hobbies",
    description: "Practice K-pop dance covers together at Gangnam Dance Studio.",
    location: "Gangnam Dance Studio",
    address: "",
    date: "May 18, 2026",
    time: "5:00 PM",
    duration: "2 hours",
    participants: 7,
    maxParticipants: 10,
    image: "https://images.unsplash.com/photo-1547153760-18fc9498cfc6",
    organizer: { name: "David Kim", avatar: "👨" }
  }
];

mongoose.connection.once("open", function() {
  // 이미 데이터 있으면 또 안넣음 (SELECT COUNT(*) FROM activities)
  Activity.countDocuments().then(function(cnt) {
    if (cnt > 0) {
      console.log("이미 데이터가 있어서 넘어갑니다");
      mongoose.disconnect();
      return;
    }

    // INSERT INTO activities (...) VALUES (...), (...) ...
    Activity.insertMany(samples).then(function() {
      console.log("예시 데이터 저장 완료!");
      mongoose.disconnect();
    });
  });
});
