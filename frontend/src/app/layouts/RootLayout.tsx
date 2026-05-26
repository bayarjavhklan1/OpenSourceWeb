import { Outlet, useLocation } from 'react-router';
import { MobileNav } from '../components/MobileNav';
import { DesktopNav } from '../components/DesktopNav';

export function RootLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-background">
      {!isAuthPage && !isLandingPage && <DesktopNav />}
      <main className={`${!isAuthPage && !isLandingPage ? 'pb-20 lg:pb-0' : ''}`}>
        <Outlet />
      </main>
      {!isAuthPage && !isLandingPage && <MobileNav />}
    </div>
  );
}
