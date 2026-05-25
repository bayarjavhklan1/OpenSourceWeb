import React from "react";
import "./Components_Css/Header.css";

// 아이콘들 react 자체에서 불러오는 방법 사용
import HomeIcon    from "../assets/icons/HomeIcon.svg?react";
import ExploreIcon from "../assets/icons/ExploreIcon.svg?react";
import CreateIcon  from "../assets/icons/CreateIcon.svg?react";
import ChatIcon    from "../assets/icons/ChatIcon.svg?react";
import BellIcon    from "../assets/icons/BellIcon.svg?react";

// currentPage: 현재 페이지 id 
// onNavigate: 페이지 전환 함수
function Header({ currentPage, onNavigate }) {
  const navItems = [
    {id: "home", label: "Home", Icon: HomeIcon},
    {id: "explore", label: "Explore", Icon: ExploreIcon},
    {id: "create", label: "Create", Icon: CreateIcon},
    {id: "chat", label: "Chat",Icon: ChatIcon, hasBadge: true},
  ];

  return (
    <header className="header">
      <div className="header_container">

        <div className="header_logo">
          <img src="/logo.png" alt="logo" className="header_logo-icon" />
        </div>

        <nav className="header_nav">
          {navItems.map((item) => (
            <div
              key={item.id}
              className={`header_nav-item ${currentPage === item.id ? "header_nav-item--active" : ""}`}
              onClick={() => onNavigate(item.id)}
            >
              <item.Icon className="header_nav-icon" />
              <span className="header_nav-label">{item.label}</span>
              {item.hasBadge && <div className="header_nav-badge"></div>}
            </div>
          ))}
        </nav>

        <div className="header_right">
          <div className="header_bell">
            <BellIcon className="header_bell-icon" />
            <div className="header_bell-badge"></div>
          </div>
          <div className="header_profile"></div>
        </div>

      </div>
    </header>
  );
}

export default Header;
