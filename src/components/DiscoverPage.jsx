import { useState, useEffect, useRef } from "react";
import ActivityCard from "./ActivityCard";
import "./Components_Css/DiscoverPage.css";

// INITIAL_ACTIVITIES는 App.jsx로 이동 → activities는 이제 props로 받음

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

// activities, setActivities를 App.jsx에서 props로 받음
function DiscoverPage({ activities, setActivities }) {

  const [filtered, setFiltered]       = useState(activities);
  const [activeTab, setActiveTab]     = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const searchRef = useRef(null);

  // 탭·검색어·activities가 바뀔 때마다 필터 실시간 계산
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
            break; // 검색에 가장 첫 부분 찾았으니 break
          }
        }
      }

      // 4. 두 주머니가 모두 true일 때만 filter 바구니에 쏙 담김
      return matchTab && matchSearch;
    });

    setFiltered(result); // 여기로 result 값 업데이트
  }, [activities, activeTab, searchQuery]); // 실시간 래랜더링



  // 좋아요 토글 -> 나중에 내가 좋아요 표시한 것 profile로 연결
  const handleToggleLike = (id) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, liked: !a.liked } : a))
    ); // ...a로 전체를 가져오는 것이고 가져온 정보가 참이면 liked 반대로 바꾸고 거짓이면 그대로
  };

  // 탭 전환 시 검색어 초기화
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery(""); // 전환을 하면 검색에 다 삭제되게 적용
  };

  // 검색어 초기화 버튼
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

      {/* ── 카드 그리드 ── */}
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
          <p>검색 결과가 없습니다.</p>
        </div>
      )}
    </main>
  );
}

export default DiscoverPage;
