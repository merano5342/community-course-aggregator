import { useNavigate } from 'react-router-dom';
import { useCompareStore } from '@/stores/useCompareStore';
import { useCourses } from '@/hooks/useCourses';
import { useIsMobile } from '@/hooks/useIsMobile';

interface CompareBarProps {
  bottomOffset?: number;
}

export function CompareBar({ bottomOffset = 0 }: CompareBarProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { ids, clear } = useCompareStore();
  const { courses } = useCourses();

  if (ids.length === 0) return null;

  const selectedCourses = ids.map((id) => courses.find((c) => c.id === id)).filter(Boolean);

  return (
    <div style={{
      position: 'fixed', bottom: bottomOffset, left: isMobile ? 0 : 'var(--sidebar-width)', right: 0,
      zIndex: 200,
      background: 'var(--color-dark)',
      borderTop: 'var(--border-on-dark)',
      padding: '0 var(--space-6)',
      height: 64,
      display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
    }}>
      <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'var(--text-sm)', flexShrink: 0 }}>
        已選 {ids.length}/3 門課
      </span>

      <div style={{ flex: 1, display: 'flex', gap: 'var(--space-2)', overflow: 'hidden' }}>
        {selectedCourses.map((c) => c && (
          <span key={c.id} style={{
            background: 'rgba(255,255,255,0.08)',
            color: 'var(--color-text-on-dark)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-pill)',
            fontSize: 'var(--text-sm)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 180,
          }}>
            {c.name}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-2)', flexShrink: 0 }}>
        <button
          onClick={clear}
          style={{
            height: 36, padding: '0 var(--space-4)',
            background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 'var(--radius-md)', color: 'rgba(255,255,255,0.6)',
            cursor: 'pointer', fontSize: 'var(--text-sm)',
          }}
        >
          清除
        </button>
        <button
          onClick={() => navigate('/compare')}
          style={{
            height: 36, padding: '0 var(--space-5)',
            background: 'var(--color-accent)', border: 'none',
            borderRadius: 'var(--radius-md)', color: 'white',
            cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)',
          }}
        >
          前往比較 →
        </button>
      </div>
    </div>
  );
}
