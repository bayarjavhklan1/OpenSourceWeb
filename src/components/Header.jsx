import React from "react";
import "./Components_Css/Header.css";


// 아이콘들 react 자체에서 불러오는 방법 사용 
import HomeIcon   from "../assets/icons/HomeIcon.svg?react";
import ExploreIcon from "../assets/icons/ExploreIcon.svg?react";
import CreateIcon  from "../assets/icons/CreateIcon.svg?react";
import ChatIcon    from "../assets/icons/ChatIcon.svg?react";
import BellIcon    from "../assets/icons/BellIcon.svg?react";

function Header() {
  const navItems = [
    { id: "home",    label: "Home",    active: true,  Icon: HomeIcon    },
    { id: "explore", label: "Explore", active: false, Icon: ExploreIcon },
    { id: "create",  label: "Create",  active: false, Icon: CreateIcon  },
    { id: "chat",    label: "Chat",    active: false, Icon: ChatIcon,   hasBadge: true },
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
              className={`header_nav-item ${item.active ? "header_nav-item--active" : ""}`}
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
