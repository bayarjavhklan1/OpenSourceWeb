import { useState } from "react";
import "./Components_Css/CreateActivityPage.css";

// 카테고리 목록
const CATEGORIES = [
  "Study Together",
  "Eat Together",
  "Exercise",
  "Language Exchange",
  "Travel",
  "Hobbies",
  "Social Events",
  "Other",
];

// 날짜 포맷 함수
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatDate(dateStr) {
  const parts = dateStr.split("-");       // ["2026", "05", "15"] 이런식으로 자르고 
  const year = parts[0];
  const month = MONTHS[parseInt(parts[1]) - 1]; // 월 인덱스는 0부터 시작
  const day = parseInt(parts[2]);
  if (!dateStr) return ""; // 예외 처리 
  return month + " " + day + ", " + year; // "May 15, 2026"
}

// 시간 포맷 함수: "18:00" → "6:00 PM"
function formatTime(timeStr) {
  const parts = timeStr.split(":");     // ["18", "00"]
  let hour = parseInt(parts[0]);
  const min = parts[1];
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;             // 0시 → 12시로 표시
  if (!timeStr) return "";
  return hour + ":" + min + " " + ampm; // "6:00 PM"
}

// activities : App.jsx에서 내려온 전체 목록
// setActivities : App.jsx에서 내려온 상태 업데이트 함수
// onNavigate : 페이지 전환 함수
function CreateActivityPage({ activities, setActivities, onNavigate }) {

  // 폼 각 필드 상태
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription]= useState("");
  const [location, setLocation] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");

  // 제출 처리
  const handleSubmit = () => {
    // 필수 항목이 비어있으면 아무것도 하지 않음
    if (!title || !category || !location || !date) {
      return;
    }

    // 날짜 + 시간 문자열 생성 → ActivityCard에서 보여주는 형식
    let dateStr = formatDate(date);
    if (time) {
      dateStr = dateStr + " · " + formatTime(time);
    }

    // 최대 참여 인원 숫자 변환 (입력 없으면 기본값 10)
    const maxNum = parseInt(maxParticipants) || 10;

    // 새 id: 기존 목록 중 가장 큰 id + 1 -> id 순회 하면서 가장 큰거 찾아서 +1 하기 
    let newId = 1;
    for (let i = 0; i < activities.length; i++) {
      if (activities[i].id >= newId) {
        newId = activities[i].id + 1;
      }
    }

    // ── INITIAL_ACTIVITIES에 추가되는 객체 
    const newActivity = {
      id: newId,
      category: category,
      title: title,
      location: location,
      date: dateStr,
      joined: 0,
      total: maxNum,
      percentage: 0,
      organizer: "You",
      image: null,
      liked: false,
    };

    // setActivities로 맨 앞에 추가 → DiscoverPage에서 바로 보임
    setActivities((prev) => [newActivity, ...prev]);

    // 등록 완료 후 홈으로 이동
    onNavigate("home");
  };

  // 필수 항목이 모두 채워졌는지 확인 → 버튼 활성/비활성
  const isFormReady = title && category && location && date;

  return (
    <main className="ca-page">

      {/* ── 상단: 뒤로가기 + 타이틀 ── */}
      <div className="ca-top">
        <button className="ca-back-btn" onClick={() => onNavigate("home")}>
          {/* 왼쪽 화살표 아이콘 (inline SVG) */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div>
          <h1 className="ca-title">Create Activity</h1>
          <p className="ca-subtitle">Share your plans with the community</p>
        </div>
      </div>

      {/* ── 커버 이미지 ── */}
      <div className="ca-section">
        <div className="ca-section-header">
          <div className="ca-section-icon">
            {/* 이미지 아이콘 */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
          <span className="ca-section-label">Cover Image</span>
        </div>

        {/* 이미지 업로드 영역 - div로 칸만 차지 */}
        <div className="ca-upload-area">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
            stroke="#f97316" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <span className="ca-upload-text">Click to upload cover image</span>
          <span className="ca-upload-hint">PNG, JPG up to 10MB</span>
        </div>
      </div>

      {/* ── 활동 제목 ── */}
      <div className="ca-section">
        <div className="ca-section-header">
          <div className="ca-section-icon">
            {/* 텍스트 줄 아이콘 */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6"  x2="20" y2="6"/>
              <line x1="4" y1="12" x2="14" y2="12"/>
              <line x1="4" y1="18" x2="18" y2="18"/>
            </svg>
          </div>
          <span className="ca-section-label">Activity Title</span>
        </div>
        <input
          className="ca-input"
          type="text"
          placeholder="e.g., Korean Language Exchange @ Cafe"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* ── 카테고리 ── */}
      <div className="ca-section">
        <div className="ca-section-header">
          <div className="ca-section-icon">
            {/* 태그 아이콘 */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
          </div>
          <span className="ca-section-label">Category</span>
        </div>
        <div className="ca-categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`ca-cat-btn ${category === cat ? "ca-cat-btn--active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── 설명 ── */}
      <div className="ca-section">
        <div className="ca-section-header">
          <div className="ca-section-icon">
            {/* 문서 아이콘 */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <span className="ca-section-label">Description</span>
        </div>
        <textarea
          className="ca-textarea"
          placeholder="Describe your activity in detail..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <p className="ca-hint">Include what participants should expect and bring.</p>
      </div>

      {/* ── 위치 ── */}
      <div className="ca-section">
        <div className="ca-section-header">
          <div className="ca-section-icon">
            {/* 핀 아이콘 (ActivityCard와 동일) */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <span className="ca-section-label">Location</span>
        </div>
        <input
          className="ca-input"
          type="text"
          placeholder="e.g., Hongdae, Seoul"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          className="ca-input ca-input--mt"
          type="text"
          placeholder="Detailed address (optional)"
          value={detailAddress}
          onChange={(e) => setDetailAddress(e.target.value)}
        />
      </div>

      {/* ── 날짜 & 시간 ── */}
      <div className="ca-section">
        <div className="ca-section-header">
          <div className="ca-section-icon">
            {/* 캘린더 아이콘 (ActivityCard와 동일) */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8"  y1="2" x2="8"  y2="6"/>
              <line x1="3"  y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <span className="ca-section-label">Date & Time</span>
        </div>

        {/* Date / Time 나란히 */}
        <div className="ca-row">
          <div className="ca-field">
            <label className="ca-field-label">Date</label>
            <input
              className="ca-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="ca-field">
            <label className="ca-field-label">Time</label>
            <input
              className="ca-input"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

        {/* Duration (optional) */}
        <input
          className="ca-input ca-input--mt"
          type="text"
          placeholder="e.g., 2 hours"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <p className="ca-hint">Duration <span className="ca-optional">(optional)</span></p>
      </div>

      {/* ── 최대 참여 인원 ── */}
      <div className="ca-section">
        <div className="ca-section-header">
          <div className="ca-section-icon">
            {/* 사람 그룹 아이콘 (ActivityCard와 동일) */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <span className="ca-section-label">Maximum Participants</span>
        </div>
        <input
          className="ca-input"
          type="number"
          placeholder="e.g., 12"
          value={maxParticipants}
          onChange={(e) => setMaxParticipants(e.target.value)}
        />
        <p className="ca-hint">Set a limit for how many people can join.</p>
      </div>

      {/* ── 하단 버튼 ── */}
      <div className="ca-actions">
        <button className="ca-btn-cancel" onClick={() => onNavigate("home")}>
          Cancel
        </button>
        <button
          className="ca-btn-submit"
          onClick={handleSubmit}
          disabled={!isFormReady}
        >
          Create Activity
        </button>
      </div>

    </main>
  );
}

export default CreateActivityPage;
