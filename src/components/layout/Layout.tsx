import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppSidebar } from '@/components/navigation/AppSidebar';
import { Header } from '@/components/layout/Header';

const PATH_TO_SIDEBAR_ITEM: Record<string, 'browse' | 'courses' | 'saved' | 'stats'> = {
  '/': 'courses',
  '/favorites': 'saved',
  '/schedule': 'stats',
};

const SIDEBAR_ITEM_TO_PATH: Record<string, string> = {
  browse: '/',
  courses: '/',
  saved: '/favorites',
  stats: '/schedule',
};

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AppSidebar
        activeItem={PATH_TO_SIDEBAR_ITEM[location.pathname] ?? 'browse'}
        onNavigate={(id) => navigate(SIDEBAR_ITEM_TO_PATH[id] ?? '/')}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1, padding: 'var(--space-6)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
