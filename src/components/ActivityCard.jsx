import { useState } from "react";
import "./Components_Css/ActivityCard.css";

// 카테고리별 배지 색상 매핑
const CATEGORY_COLORS = {
  "Language Exchange": { bg: "#dbeafe", text: "#1d4ed8" },
  "Travel":            { bg: "#ffedd5", text: "#c2410c" },
  "Study Together":    { bg: "#ede9fe", text: "#6d28d9" },
  "Eat Together":      { bg: "#dcfce7", text: "#15803d" },
  "Exercise":          { bg: "#fce7f3", text: "#be185d" },
  "Hobbies":           { bg: "#fef9c3", text: "#a16207" },
};

// 카테고리별 플레이스홀더 배경색
const CATEGORY_PLACEHOLDER_BG = {
  "Language Exchange": "#eff6ff",
  "Travel":            "#fff7ed",
  "Study Together":    "#f5f3ff",
  "Eat Together":      "#f0fdf4",
  "Exercise":          "#fdf2f8",
  "Hobbies":           "#fefce8",
};

// 조직자 아바타 이니셜 추출
function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// 조직자별 아바타 배경색
const AVATAR_COLORS = [
  "#f97316", "#8b5cf6", "#06b6d4",
  "#10b981", "#ec4899", "#3b82f6",
];
function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

// ─── 카드 템플릿 ───────────────────────────────────────────────
function ActivityCard({ activity, onToggleLike }) {
  const {
    id, category, title, location, date,
    joined, total, percentage, organizer, image, liked,
  } = activity;

  const badgeStyle    = CATEGORY_COLORS[category] ?? { bg: "#e5e7eb", text: "#374151" };
  const placeholderBg = CATEGORY_PLACEHOLDER_BG[category] ?? "#f3f4f6";

  return (
    <div className="ac-card">
      {/* ── 이미지 영역 ── */}
      <div className="ac-image-wrap">
        {image ? (
          <img src={image} alt={title} className="ac-image" />
        ) : (
          // 이미지 없을 때 카테고리 색상 배경
          <div className="ac-placeholder" style={{ backgroundColor: placeholderBg }} />
        )}

        {/* 카테고리 배지 */}
        <span
          className="ac-badge"
          style={{ backgroundColor: badgeStyle.bg, color: badgeStyle.text }}
        >
          {category}
        </span>

        {/* 좋아요 버튼 */}
        <button
          className={`ac-like-btn ${liked ? "ac-like-btn--active" : ""}`}
          onClick={() => onToggleLike(id)}
          aria-label="좋아요"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? "#ef4444" : "none"}
            stroke={liked ? "#ef4444" : "#9ca3af"} strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06
              a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78
              1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      {/* ── 카드 본문 ── */}
      <div className="ac-body">
        <h3 className="ac-title">{title}</h3>

        {/* 위치 */}
        <div className="ac-meta">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span>{location}</span>
        </div>

        {/* 날짜 */}
        <div className="ac-meta">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>{date}</span>
        </div>

        {/* 참여 인원 + 진행 바 */}
        <div className="ac-participants">
          <div className="ac-participants-row">
            <div className="ac-participants-left">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span>{joined}/{total} joined</span>
            </div>
            <span className="ac-percentage">{percentage}%</span>
          </div>
          <div className="ac-progress-track">
            <div
              className="ac-progress-fill"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* 구분선 */}
        <div className="ac-divider" />

        {/* 주최자 */}
        <div className="ac-organizer">
          <div
            className="ac-organizer-avatar"
            style={{ backgroundColor: getAvatarColor(organizer) }}
          >
            {getInitials(organizer)}
          </div>
          <div className="ac-organizer-info">
            <span className="ac-organizer-label">Organized by</span>
            <span className="ac-organizer-name">{organizer}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityCard;
