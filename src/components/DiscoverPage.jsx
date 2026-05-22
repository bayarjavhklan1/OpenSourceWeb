import { useState, useEffect, useRef } from "react";
import ActivityCard from "./ActivityCard";
import "./Components_Css/DiscoverPage.css";

// data, db에서 가져오는 데이터 임의로 작성
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

// 카테고리 탭 목록
const TABS = [
  "All",
  "Study Together",
  "Eat Together",
  "Exercise",
  "Language Exchange",
  "Travel",
  "Hobbies",
];




function DiscoverPage() {
 
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [filtered, setFiltered]     = useState(INITIAL_ACTIVITIES);
  // 입력 받는 데이터 받기 -> 여기서 

  const [activeTab, setActiveTab]   = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  

  
  const searchRef = useRef(null);

  // ── useEffect: 탭·검색어·좋아요가 바뀔 때마다 필터 실시간 계산
  useEffect(() => {
  const keyword = searchQuery.toLowerCase().trim(); // 1. 검색어 소문자 변환 및 가공 

  const result = activities.filter((a) => {
    // 2. 카테고리 조건 검사 (true / false 저장)
    const matchTab = activeTab === "All" || a.category === activeTab;

    // 3. matchSearch 조건 기본값 false로 시작
    let matchSearch = false;

    if (keyword === "") {
      // 검색어가 비어있다면 무조건 검색 조건 통과(true) -> 다 검색 가능하게 
      matchSearch = true;
    } else {
      // 검사하고 싶은 항목들을 배열로 묶음 -> 나중에 추가 가능 
      const fields = [a.title, a.location, a.organizer];

      // 반복문으로 하나씩 꺼내서 확인
      for (let i = 0; i < fields.length; i++) {
        const fieldLowerCase = fields[i].toLowerCase(); // 소문자로 변환

        // 만약(if) 항목 중에 검색어가 포함되어 있다면?
        if (fieldLowerCase.includes(keyword)) {
          matchSearch = true; // 통과 
          break;              // 검색에 가장 첫 부분 찾았으니 break 
        }
      }
    }

    // 4. 두 주머니가 모두 true일 때만 filter 바구니에 쏙 담김 
    return matchTab && matchSearch;
  });

  setFiltered(result); // 여기로 result 값 업데이트 
}, [activities, activeTab, searchQuery]); // 실시간 리랜더링 적용 

 

  // 좋아요 토글 -> 나중에 내가 좋아요 표시한 것 profile로 연결 
  const handleToggleLike = (id) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, liked: !a.liked } : a))
    ); // ...a로 전체를 가져오는 것이고 가져온 정보가 참이면 liked 반대로 바꾸고 거짓이면 그대로
  };



  // 탭 전환 시 검색어 초기화 + 검색창 포커스 (useRef)
  const handleTabChange = (tab) => {
   setActiveTab(tab);
   setSearchQuery(""); // 전환을 하면 검색에 다 삭제되게 적용 
   
  };
  

  // 검색어 초기화 버튼 클릭 시 검색창 포커스 유지 (useRef)
  const handleClearSearch = () => {
    setSearchQuery("");
   
  };

  
  return (
    <main className="dp-page">
      {/* ── 헤더 텍스트 ── */}
      <div className="dp-hero">
        <h1 className="dp-title">Discover Activities</h1>
        <p className="dp-subtitle">Find your next adventure with fellow students</p>
      </div>

      {/* ── 검색 바 ── */}
      <div className="dp-search-wrap">
        {/*나중에 여기다가 검색 아이콘 넣기*/}
        <input
          ref={searchRef}
          className="dp-search-input"
          type="text"
          placeholder="Search activities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
          
          <button className="dp-search-clear" onClick={handleClearSearch}>X</button>
        
      </div>

      {/* ── 카테고리 탭 ── */}
      {/*모든걸 button으로 바꿔야함 -> tabs에 포함된 거 다 랜더링 하게 하기(tabs에 있는 것만 랜더링 하는 방식 찾아보기) */}
      <div className="dp-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`dp-tab ${activeTab === tab ? "dp-tab--active" : ""}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/*  카드 그리드  */}
      {filtered.length > 0 ? (
        <div className="dp-grid">
          {filtered.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onToggleLike={handleToggleLike}
            />
          ))}
        </div>
      ) : (
        <div className="dp-empty">
          <p>검색 결과가 없습니다. 다른 키워드로 시도해보세요!</p>
        </div>
      )}
    </main>
  );
}

export default DiscoverPage;
