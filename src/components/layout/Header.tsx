import { NavLink } from 'react-router-dom';
import { Badge } from '@/components/core/Badge';
import { useIsMobile } from '@/hooks/useIsMobile';

const NAV_LINKS = [
  { to: '/', label: '首頁', end: true },
  { to: '/courses', label: '課程列表' },
  { to: '/compare', label: '跨校比較' },
  { to: '/favorites', label: '我的最愛' },
  { to: '/schedule', label: '時間表' },
  { to: '/about', label: '關於' },
];

export interface HeaderProps {
  favoritesCount?: number;
  compareCount?: number;
}

export function Header({ favoritesCount = 0, compareCount = 0 }: HeaderProps) {
  const isMobile = useIsMobile();

  return (
    <header
      style={{
        height: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-4)',
        background: 'var(--color-surface-bg)',
        borderBottom: 'var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 'var(--weight-bold)',
            fontSize: 'var(--text-lg)',
          }}
        >
          鄰學
        </span>
        {!isMobile && (
          <nav style={{ display: 'flex', gap: 'var(--space-5)' }}>
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                style={({ isActive }) => ({
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-base)',
                  fontWeight: isActive ? 'var(--weight-semibold)' : 'var(--weight-regular)',
                  color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  textDecoration: 'none',
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        {favoritesCount > 0 && <Badge variant="accent">最愛 {favoritesCount}</Badge>}
        {compareCount > 0 && <Badge variant="dark">比較 {compareCount}</Badge>}
      </div>
    </header>
  );
}
