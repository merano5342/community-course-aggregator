import type { Course } from '@/types/course';
import { Badge } from '@/components/core/Badge';
import {
  getSchoolInfo, STATUS_INFO, formatFee, formatOriginalFee,
  formatDaySlot, DISCOUNT_MAP,
} from '@/lib/courseUtils';

interface CourseCardProps {
  course: Course;
  isFavorite: boolean;
  isInCompare: boolean;
  isCompareFull: boolean;
  onViewDetail: (course: Course) => void;
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => boolean;
}

export function CourseCard({
  course, isFavorite, isInCompare, isCompareFull,
  onViewDetail, onToggleFavorite, onToggleCompare,
}: CourseCardProps) {
  const school = getSchoolInfo(course.school);
  const status = STATUS_INFO[course.status];
  const hasDiscount = !!course.discount && !!DISCOUNT_MAP[course.discount];

  const stopProp = (fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    fn();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onViewDetail(course)}
      onKeyDown={(e) => e.key === 'Enter' && onViewDetail(course)}
      style={{
        background: 'var(--color-white)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        cursor: 'pointer',
        transition: 'transform var(--dur-fast) var(--ease-std)',
        outline: 'none',
        border: 'var(--border-subtle)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = '')}
    >
      {/* Badge row */}
      <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center',
          padding: '3px 10px', borderRadius: 'var(--radius-pill)',
          fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)',
          letterSpacing: 'var(--tracking-wide)',
          background: school.bg, color: school.color,
        }}>
          {school.short}
        </span>
        <Badge variant={status.variant} dot>{status.label}</Badge>
        {course.isNew && <Badge variant="accent">NEW</Badge>}
        {course.isMixed && <Badge variant="neutral">混成</Badge>}
        {course.semester && (
          <span style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '3px 8px', borderRadius: 'var(--radius-pill)',
            fontSize: 11, fontWeight: 'var(--weight-medium)',
            background: 'var(--color-surface-card)',
            color: 'var(--color-text-muted)',
            border: 'var(--border-subtle)',
          }}>
            {course.semester}
          </span>
        )}
      </div>

      {/* Course name */}
      <div style={{
        fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)',
        lineHeight: 'var(--leading-snug)', color: 'var(--color-text-primary)',
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {course.name}
      </div>

      {/* Info */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 6,
        fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)',
      }}>
        <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
          {course.teacher.length > 0 ? course.teacher.join('、') : '—'}
        </span>
        <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          {formatDaySlot(course.dayOfWeek, course.timeSlot)}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            {hasDiscount
              ? <><span style={{ textDecoration: 'line-through', opacity: 0.6 }}>{formatOriginalFee(course.fee)}</span>{' '}{formatFee(course.fee, course.discount)}</>
              : formatFee(course.fee)}
            {hasDiscount && (
              <span style={{ color: 'var(--color-error)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-xs)' }}>
                {course.discount}
              </span>
            )}
          </span>
          {course.weeks && (
            <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
              共 {course.weeks} 週
            </span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{
        display: 'flex', gap: 'var(--space-2)', marginTop: 'auto', paddingTop: 'var(--space-1)',
        borderTop: 'var(--border-subtle)',
      }}>
        <button
          onClick={stopProp(() => onToggleFavorite(course.id))}
          title={isFavorite ? '移除收藏' : '加入最愛'}
          style={{
            flex: 1, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 5, border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer',
            fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)',
            background: isFavorite ? 'var(--color-error-subtle)' : 'var(--color-surface-card)',
            color: isFavorite ? 'var(--color-error)' : 'var(--color-text-secondary)',
            transition: 'background var(--dur-fast)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {isFavorite ? '已收藏' : '收藏'}
        </button>

        <button
          onClick={stopProp(() => onToggleCompare(course.id))}
          disabled={!isInCompare && isCompareFull}
          title={isInCompare ? '移除比較' : isCompareFull ? '比較清單已滿（最多3門）' : '加入比較'}
          style={{
            flex: 1, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 5, border: 'none', borderRadius: 'var(--radius-md)', cursor: (!isInCompare && isCompareFull) ? 'not-allowed' : 'pointer',
            fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)',
            background: isInCompare ? 'var(--color-accent-subtle)' : 'var(--color-surface-card)',
            color: isInCompare ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            opacity: (!isInCompare && isCompareFull) ? 0.45 : 1,
            transition: 'background var(--dur-fast)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
          {isInCompare ? '比較中' : '比較'}
        </button>
      </div>
    </div>
  );
}
