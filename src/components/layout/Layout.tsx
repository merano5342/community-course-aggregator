import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppSidebar } from '@/components/navigation/AppSidebar';
import { Header } from '@/components/layout/Header';
import { CompareBar } from '@/components/courses/CompareBar';
import { useFavoritesStore } from '@/stores/useFavoritesStore';
import { useCompareStore } from '@/stores/useCompareStore';

const PATH_TO_SIDEBAR_ITEM: Record<string, 'browse' | 'courses' | 'saved' | 'stats'> = {
  '/': 'courses',
  '/compare': 'browse',
  '/favorites': 'saved',
  '/schedule': 'stats',
};

const SIDEBAR_ITEM_TO_PATH: Record<string, string> = {
  browse: '/compare',
  courses: '/',
  saved: '/favorites',
  stats: '/schedule',
};

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const favCount = useFavoritesStore((s) => s.ids.length);
  const compareCount = useCompareStore((s) => s.ids.length);
  const showCompareBar = compareCount > 0 && location.pathname !== '/compare';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AppSidebar
        activeItem={PATH_TO_SIDEBAR_ITEM[location.pathname] ?? 'browse'}
        onNavigate={(id) => navigate(SIDEBAR_ITEM_TO_PATH[id] ?? '/')}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header favoritesCount={favCount} compareCount={compareCount} />
        <main style={{
          flex: 1,
          padding: 'var(--space-6)',
          paddingBottom: showCompareBar ? 'calc(var(--space-6) + 64px)' : 'var(--space-6)',
        }}>
          <Outlet />
        </main>
      </div>
      <CompareBar />
    </div>
  );
}
