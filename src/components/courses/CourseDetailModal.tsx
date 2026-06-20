import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Course } from '@/types/course';
import { Badge } from '@/components/core/Badge';
import { Button } from '@/components/core/Button';
import {
  getSchoolInfo, STATUS_INFO, DAY_LABELS, TIME_SLOT_LABELS,
  DISCOUNT_MAP, formatFee, formatOriginalFee,
} from '@/lib/courseUtils';

interface Props {
  course: Course;
  isFavorite: boolean;
  isInCompare: boolean;
  isCompareFull: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => boolean;
}

function InfoRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
      <span style={{ color: 'var(--color-text-muted)', flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-primary)', lineHeight: 'var(--leading-normal)' }}>
        {children}
      </span>
    </div>
  );
}

export function CourseDetailModal({
  course, isFavorite, isInCompare, isCompareFull,
  onClose, onToggleFavorite, onToggleCompare,
}: Props) {
  const school = getSchoolInfo(course.school);
  const status = STATUS_INFO[course.status];
  const hasDiscount = !!course.discount && !!DISCOUNT_MAP[course.discount];

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'var(--space-4)',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(28,28,28,0.55)',
          backdropFilter: 'blur(2px)',
        }}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal
        style={{
          position: 'relative', zIndex: 1,
          background: 'var(--color-white)',
          borderRadius: 'var(--radius-xl)',
          width: '100%', maxWidth: 560,
          maxHeight: '90vh', overflowY: 'auto',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{
          padding: 'var(--space-5)',
          borderBottom: 'var(--border-subtle)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-3)',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap', marginBottom: 'var(--space-2)' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '3px 10px', borderRadius: 'var(--radius-pill)',
                fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)',
                letterSpacing: 'var(--tracking-wide)',
                background: school.bg, color: school.color,
              }}>
                {school.name}
              </span>
              <Badge variant={status.variant} dot>{status.label}</Badge>
              {course.isNew && <Badge variant="accent">NEW</Badge>}
              {course.isMixed && <Badge variant="neutral">線上+實體</Badge>}
            </div>
            <h2 style={{
              margin: 0, fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)',
              lineHeight: 'var(--leading-snug)', color: 'var(--color-text-primary)',
            }}>
              {course.name}
            </h2>
            <p style={{ margin: '6px 0 0', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              {course.category}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="關閉"
            style={{
              width: 36, height: 36, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', borderRadius: 'var(--radius-md)',
              background: 'var(--color-surface-card)', cursor: 'pointer',
              color: 'var(--color-text-secondary)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-3)',
          }}>
            <InfoRow icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>授課老師</span><br/>
              {course.teacher.length > 0 ? course.teacher.join('、') : '—'}
            </InfoRow>

            <InfoRow icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>上課時間</span><br/>
              每週{DAY_LABELS[course.dayOfWeek]}・{TIME_SLOT_LABELS[course.timeSlot]}
            </InfoRow>

            <InfoRow icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>學分費</span><br/>
              {hasDiscount
                ? <><s style={{ opacity: 0.5 }}>{formatOriginalFee(course.fee)}</s>{' '}
                    <strong style={{ color: 'var(--color-accent)' }}>{formatFee(course.fee, course.discount)}</strong>
                    {' '}<span style={{ color: 'var(--color-error)', fontSize: 'var(--text-sm)' }}>{course.discount}</span>
                  </>
                : formatFee(course.fee)
              }
            </InfoRow>

            <InfoRow icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>開課日期</span><br/>
              {new Date(course.startDate).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}
              {course.weeks ? `・共 ${course.weeks} 週` : ''}
            </InfoRow>

            <InfoRow icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>上課地點</span><br/>
              {course.location}
            </InfoRow>

            <InfoRow icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>名額狀態</span><br/>
              <span style={{ color: status.variant === 'error' ? 'var(--color-error)' : 'var(--color-text-primary)' }}>
                {status.label}
              </span>
            </InfoRow>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{
          padding: 'var(--space-4) var(--space-5)',
          borderTop: 'var(--border-subtle)',
          display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap',
        }}>
          <Button
            variant={isFavorite ? 'accent' : 'surface'}
            size="md"
            onClick={() => onToggleFavorite(course.id)}
            style={{ flex: 1, minWidth: 120 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {isFavorite ? '已加入最愛' : '加入最愛'}
          </Button>

          <Button
            variant={isInCompare ? 'accent' : 'surface'}
            size="md"
            disabled={!isInCompare && isCompareFull}
            onClick={() => onToggleCompare(course.id)}
            style={{ flex: 1, minWidth: 120 }}
          >
            {isInCompare ? '比較中' : '加入比較'}
          </Button>

          <a
            href={course.detailUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => course.status === 'cancelled' && e.preventDefault()}
            style={{
              flex: 2, minWidth: 140,
              height: 'var(--btn-height-md)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              gap: 'var(--space-2)',
              background: course.status === 'cancelled' ? 'var(--color-surface-card)' : 'var(--color-accent)',
              color: course.status === 'cancelled' ? 'var(--color-text-muted)' : 'white',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)',
              cursor: course.status === 'cancelled' ? 'not-allowed' : 'pointer',
              opacity: course.status === 'cancelled' ? 0.55 : 1,
            }}
          >
            前往報名
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>
      </div>
    </div>,
    document.body,
  );
}
