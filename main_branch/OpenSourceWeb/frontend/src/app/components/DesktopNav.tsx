import {
  Home,
  Compass,
  PlusCircle,
  MessageCircle,
  User,
  Bell,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import logo from "../../assets/Screenshot 2026-05-25 at 22.17.52.png";
export function DesktopNav() {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("user");

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Compass, label: "Explore", path: "/feed" },
  ];

  if (isLoggedIn) {
    navItems.push(
      { icon: PlusCircle, label: "Create", path: "/create" },
      { icon: MessageCircle, label: "Chat", path: "/chat" }
    );
  }

  return (
    <nav className="hidden lg:block sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="">
              <img src={logo} alt="logo" className="w-20 h-8 object-cover" />
            </div>
          </Link>

          <div className="flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    isActive
                      ? "text-primary bg-secondary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span className={`${isActive ? "font-medium" : ""}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}

            {isLoggedIn && (
              <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
              </button>
            )}

            {isLoggedIn ? (
              <Link to="/profile" className="ml-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
              </Link>
            ) : (
              <Link
                to="/auth"
                className="ml-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-semibold shadow-sm hover:shadow-md transition-all text-sm"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
