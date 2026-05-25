import React, { useState } from "react";
import Header from "./components/Header";
import DiscoverPage from "./components/DiscoverPage";
import CreateActivityPage from "./components/CreateActivityPage";
import "./App.css";

// data, db에서 가져오는 데이터 임의로 작성 (DiscoverPage에서 이동)
const INITIAL_ACTIVITIES = [
  {
    id: 1,
    category: "Language Exchange",
    title: "Korean Language Exchange @ Cafe",
    location: "Hongdae, Seoul",
    date: "May 15, 2026 · 6:00 PM",
    joined: 8,
    total: 12,
    percentage: 67,
    organizer: "Sarah Kim",
    image: null,
    liked: false,
  },
  {
    id: 2,
    category: "Travel",
    title: "Weekend Hiking to Bukhansan",
    location: "Bukhansan National Park",
    date: "May 17, 2026 · 8:00 AM",
    joined: 15,
    total: 20,
    percentage: 75,
    organizer: "Mike Chen",
    image: null,
    liked: true,
  },
  {
    id: 3,
    category: "Study Together",
    title: "Study Group - Midterm Prep",
    location: "University Library",
    date: "May 14, 2026 · 3:00 PM",
    joined: 6,
    total: 8,
    percentage: 75,
    organizer: "Emma Lee",
    image: null,
    liked: false,
  },
  {
    id: 4,
    category: "Eat Together",
    title: "Thai Food Cooking Night",
    location: "Itaewon Community Kitchen",
    date: "May 16, 2026 · 7:00 PM",
    joined: 10,
    total: 15,
    percentage: 67,
    organizer: "Alex Park",
    image: null,
    liked: false,
  },
  {
    id: 5,
    category: "Exercise",
    title: "Morning Yoga in the Park",
    location: "Han River Park",
    date: "May 14, 2026 · 7:00 AM",
    joined: 12,
    total: 15,
    percentage: 80,
    organizer: "Julia Martinez",
    image: null,
    liked: true,
  },
  {
    id: 6,
    category: "Hobbies",
    title: "K-Pop Dance Cover Practice",
    location: "Gangnam Dance Studio",
    date: "May 18, 2026 · 5:00 PM",
    joined: 7,
    total: 10,
    percentage: 70,
    organizer: "David Kim",
    image: null,
    liked: false,
  },
  {
    id: 7,
    category: "Study Together",
    title: "Algorithm Study with Snacks",
    location: "Sinchon Cafe Study Room",
    date: "May 20, 2026 · 4:00 PM",
    joined: 4,
    total: 6,
    percentage: 67,
    organizer: "Ji-ho Yoon",
    image: null,
    liked: false,
  },
  {
    id: 8,
    category: "Eat Together",
    title: "Sunday Brunch Meetup",
    location: "Yeonnam-dong Cafe Street",
    date: "May 19, 2026 · 11:00 AM",
    joined: 9,
    total: 12,
    percentage: 75,
    organizer: "Hana Seo",
    image: null,
    liked: false,
  },
  {
    id: 9,
    category: "Exercise",
    title: "Weekend Basketball Game",
    location: "Olympic Park Court",
    date: "May 21, 2026 · 10:00 AM",
    joined: 14,
    total: 20,
    percentage: 70,
    organizer: "Chris Jang",
    image: null,
    liked: false,
  },
];

const App = () => {
  // 현재 페이지 상태: explore | create -> 나중에 추가 예정 
  const [currentPage, setCurrentPage] = useState("explore");

  // activities 상태를 App에서 관리 → 여러 페이지에서 공유 가능
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);

  return (
    <div className="app">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* 현재 페이지에 따라 페이지 전환 */}
      {currentPage === "explore" && (
        <DiscoverPage activities={activities} setActivities={setActivities} />
      )}
      {currentPage === "create" && (
        <CreateActivityPage
          activities={activities}
          setActivities={setActivities}
          onNavigate={setCurrentPage}
        />
      )}
    </div>
  );
};

export default App;
