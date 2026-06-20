import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppSidebar, type SidebarItemId } from '@/components/navigation/AppSidebar';
import { Header } from '@/components/layout/Header';
import { CompareBar } from '@/components/courses/CompareBar';
import { useFavoritesStore } from '@/stores/useFavoritesStore';
import { useCompareStore } from '@/stores/useCompareStore';
import { useIsMobile } from '@/hooks/useIsMobile';

const PATH_TO_SIDEBAR: Record<string, SidebarItemId> = {
  '/': 'home',
  '/courses': 'courses',
  '/compare': 'compare',
  '/favorites': 'saved',
  '/schedule': 'schedule',
};

const SIDEBAR_TO_PATH: Record<SidebarItemId, string> = {
  home: '/',
  courses: '/courses',
  compare: '/compare',
  saved: '/favorites',
  schedule: '/schedule',
};

const MOBILE_NAV: { id: SidebarItemId; label: string; icon: React.ReactNode }[] = [
  {
    id: 'home', label: '首頁',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
  {
    id: 'courses', label: '課程',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="15" y2="18"/></svg>,
  },
  {
    id: 'saved', label: '最愛',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3h14a2 2 0 0 1 2 2v16l-7-4-7 4V5a2 2 0 0 1 2-2z"/></svg>,
  },
  {
    id: 'schedule', label: '時間表',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  },
  {
    id: 'compare', label: '比較',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  },
];

const MOBILE_NAV_H = 60;

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const favCount = useFavoritesStore((s) => s.ids.length);
  const compareCount = useCompareStore((s) => s.ids.length);
  const showCompareBar = compareCount > 0 && location.pathname !== '/compare';
  const activeItem = PATH_TO_SIDEBAR[location.pathname] ?? 'home';

  const compareBarBottom = isMobile ? MOBILE_NAV_H : 0;
  const mainPaddingBottom = isMobile
    ? `${MOBILE_NAV_H + (showCompareBar ? 60 : 0) + 24}px`
    : showCompareBar
      ? 'calc(var(--space-6) + 64px)'
      : 'var(--space-6)';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Desktop sidebar */}
      {!isMobile && (
        <AppSidebar
          activeItem={activeItem}
          onNavigate={(id) => navigate(SIDEBAR_TO_PATH[id] ?? '/')}
        />
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header favoritesCount={favCount} compareCount={compareCount} />
        <main style={{
          flex: 1,
          padding: isMobile ? 'var(--space-4)' : 'var(--space-6)',
          paddingBottom: mainPaddingBottom,
        }}>
          <Outlet />
        </main>
      </div>

      <CompareBar bottomOffset={compareBarBottom} />

      {/* Mobile bottom nav */}
      {isMobile && (
        <nav style={{
          position: 'fixed',
          bottom: 0, left: 0, right: 0,
          height: MOBILE_NAV_H,
          background: 'var(--color-dark)',
          display: 'flex',
          zIndex: 190,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}>
          {MOBILE_NAV.map((item) => {
            const isActive = activeItem === item.id;
            const badge = item.id === 'saved' ? favCount : item.id === 'compare' ? compareCount : 0;
            return (
              <button
                key={item.id}
                onClick={() => navigate(SIDEBAR_TO_PATH[item.id])}
                style={{
                  flex: 1, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: 3, border: 'none', background: 'none', cursor: 'pointer',
                  color: isActive ? 'var(--color-accent-on-dark)' : 'rgba(255,255,255,0.38)',
                  position: 'relative',
                  paddingTop: 4,
                }}
              >
                {item.icon}
                <span style={{ fontSize: 10, fontWeight: isActive ? 'var(--weight-semibold)' : 'var(--weight-regular)' }}>
                  {item.label}
                </span>
                {badge > 0 && (
                  <span style={{
                    position: 'absolute', top: 4, right: '20%',
                    minWidth: 16, height: 16, borderRadius: 8,
                    background: 'var(--color-accent-on-dark)',
                    color: 'var(--color-dark)',
                    fontSize: 10, fontWeight: 'var(--weight-bold)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '0 4px',
                  }}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
