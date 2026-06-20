import type { ReactNode } from 'react';

export type SidebarItemId = 'home' | 'courses' | 'saved' | 'schedule' | 'compare';

export interface AppSidebarProps {
  activeItem?: SidebarItemId;
  onNavigate?: (id: SidebarItemId) => void;
}

interface NavItem {
  id: SidebarItemId;
  label: string;
  icon: ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    label: '首頁',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    id: 'courses',
    label: '課程列表',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="15" y2="18" />
      </svg>
    ),
  },
  {
    id: 'saved',
    label: '已收藏',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 3h14a2 2 0 0 1 2 2v16l-7-4-7 4V5a2 2 0 0 1 2-2z" />
      </svg>
    ),
  },
  {
    id: 'schedule',
    label: '時間表',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    id: 'compare',
    label: '跨校比較',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
];

export function AppSidebar({ activeItem = 'home', onNavigate }: AppSidebarProps) {
  return (
    <nav
      style={{
        width: 'var(--sidebar-width)',
        minHeight: '100%',
        background: 'var(--color-dark)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 'var(--space-5) 0',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 3,
          width: 26,
          height: 26,
          marginBottom: 'var(--space-7)',
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              borderRadius: 3,
              background: i === 1 || i === 2 ? 'var(--color-accent-on-dark)' : 'rgba(255,255,255,0.80)',
            }}
          />
        ))}
      </div>

      {/* Nav items */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
          width: '100%',
          alignItems: 'center',
        }}
      >
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            title={item.label}
            onClick={() => onNavigate?.(item.id)}
            style={{
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-md)',
              background: activeItem === item.id ? 'rgba(255,255,255,0.10)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: activeItem === item.id ? 'var(--color-accent-on-dark)' : 'rgba(255,255,255,0.38)',
              transition: 'background var(--dur-fast), color var(--dur-fast)',
            }}
          >
            {item.icon}
          </button>
        ))}
      </div>

      <button
        title="關於"
        onClick={() => onNavigate?.('home')}
        style={{
          marginTop: 'auto',
          width: 44,
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'var(--radius-md)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'rgba(255,255,255,0.28)',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </button>
    </nav>
  );
}
