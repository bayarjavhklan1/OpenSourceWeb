import { Home, Compass, PlusCircle, MessageCircle, User } from 'lucide-react';
import { Link, useLocation } from 'react-router';

export function MobileNav() {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("user");

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Compass, label: 'Explore', path: '/feed' },
  ];

  if (isLoggedIn) {
    navItems.push(
      { icon: PlusCircle, label: 'Create', path: '/create' },
      { icon: MessageCircle, label: 'Chat', path: '/chat' },
      { icon: User, label: 'Profile', path: '/profile' }
    );
  } else {
    navItems.push(
      { icon: User, label: 'Login', path: '/auth' }
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg lg:hidden z-50">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.path === '/' 
            ? location.pathname === '/' 
            : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-xs ${isActive ? 'font-medium' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
