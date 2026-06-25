import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Course } from '@/types/course';
import { Badge } from '@/components/core/Badge';
import { Button } from '@/components/core/Button';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useCourseDetail } from '@/hooks/useCourses';
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

type Tab = 'info' | 'outline';

function getSemesterStyle(semester: string): { bg: string; color: string } {
  if (semester.includes('暑')) return { bg: '#fde8c4', color: '#9a6020' };
  if (semester.includes('春')) return { bg: '#d4e8cc', color: '#407840' };
  return { bg: '#f0d8c8', color: '#8a4830' };
}

function InfoRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
      <span style={{ color: 'var(--color-text-muted)', flexShrink: 0, marginTop: 2 }}>{icon}</span>
      <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-primary)', lineHeight: 'var(--leading-normal)' }}>
        {children}
      </span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)',
      color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)',
    }}>
      {children}
    </div>
  );
}

export function CourseDetailModal({
  course, isFavorite, isInCompare, isCompareFull,
  onClose, onToggleFavorite, onToggleCompare,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const isMobile = useIsMobile();
  const { course: detail, isLoading: detailLoading } = useCourseDetail(course.school, course.id);
  const full: Course = { ...course, ...(detail ?? {}) };
  const school = getSchoolInfo(course.school);
  const status = STATUS_INFO[course.status];
  const semesterStyle = course.semester ? getSemesterStyle(course.semester) : null;
  const hasDiscount = !!course.discount && !!DISCOUNT_MAP[course.discount];
  const hasRichContent = detailLoading || !!(full.description || full.outline?.length || full.targetAudience || full.teacherBio || full.notes);
  const hasOutline = !!(full.outline && full.outline.length > 0);

  // Desktop: two columns only when there's an outline (or still loading)
  const showTwoColumns = !isMobile && (detailLoading || hasOutline);
  // Mobile: show tabs only when there's rich content
  const showMobileTabs = isMobile && hasRichContent;

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

  const dialogStyle: React.CSSProperties = isMobile
    ? {
        position: 'fixed', left: 0, right: 0, bottom: 0, top: 'auto',
        width: '100%', maxWidth: '100%', maxHeight: '92vh',
        borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
      }
    : {
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: showTwoColumns ? 960 : 600,
        maxHeight: '90vh',
        borderRadius: 'var(--radius-xl)',
      };

  // ── Shared content blocks ────────────────────────────────────────────────

  const quotaBar = course.quota != null && course.enrolled != null ? (
    <div style={{
      background: 'var(--color-surface-card)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-3) var(--space-4)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', marginBottom: 8 }}>
        <span style={{ color: 'var(--color-text-secondary)' }}>報名進度</span>
        <span style={{ fontWeight: 'var(--weight-semibold)' }}>
          {course.enrolled} / {course.quota} 人
        </span>
      </div>
      <div style={{ height: 6, background: 'var(--color-surface-border)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${Math.min(100, (course.enrolled / course.quota) * 100)}%`,
          background: course.enrolled >= course.quota ? 'var(--color-error)' : 'var(--color-accent)',
          borderRadius: 3,
          transition: 'width 0.4s ease',
        }} />
      </div>
    </div>
  ) : null;

  const infoGrid = (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
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
  );

  const notesBlock = course.notes ? (
    <div style={{
      background: 'var(--color-warning-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-3) var(--space-4)',
      fontSize: 'var(--text-sm)',
      color: 'var(--color-text-secondary)',
      lineHeight: 'var(--leading-normal)',
      whiteSpace: 'pre-line',
    }}>
      <div style={{ fontWeight: 'var(--weight-semibold)', marginBottom: 4, color: 'var(--color-text-primary)' }}>
        注意事項
      </div>
      {course.notes}
    </div>
  ) : null;

  // ── Left-column text blocks: description · targetAudience · teacherBio ───

  const leftRichContent = detailLoading ? (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 'var(--space-6) 0', color: 'var(--color-text-muted)',
      fontSize: 'var(--text-sm)',
    }}>
      載入詳細資料中…
    </div>
  ) : (
    <>
      {full.description && (
        <div>
          <SectionLabel>課程介紹</SectionLabel>
          <p style={{
            margin: 0,
            fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)',
            color: 'var(--color-text-primary)',
            whiteSpace: 'pre-line',
          }}>
            {full.description}
          </p>
        </div>
      )}

      {full.targetAudience && (
        <div>
          <SectionLabel>適合對象</SectionLabel>
          <p style={{
            margin: 0,
            fontSize: 'var(--text-base)', lineHeight: 'var(--leading-normal)',
            color: 'var(--color-text-primary)',
            whiteSpace: 'pre-line',
          }}>
            {full.targetAudience}
          </p>
        </div>
      )}

      {full.teacherBio && (
        <div>
          <SectionLabel>老師簡介</SectionLabel>
          <div style={{
            display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start',
            padding: 'var(--space-3) var(--space-4)',
            background: 'var(--color-surface-card)',
            borderRadius: 'var(--radius-lg)',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: school.bg, color: school.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 'var(--text-base)', fontWeight: 'var(--weight-bold)',
            }}>
              {course.teacher[0]?.[0] ?? '師'}
            </div>
            <p style={{
              margin: 0,
              fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)',
              color: 'var(--color-text-primary)',
              whiteSpace: 'pre-line',
            }}>
              {full.teacherBio}
            </p>
          </div>
        </div>
      )}
    </>
  );

  // ── Right-column block: outline only ────────────────────────────────────

  const outlineBlock = hasOutline ? (
    <div>
      <SectionLabel>課程大綱</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        {full.outline!.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start',
              padding: 'var(--space-2) var(--space-3)',
              borderRadius: 'var(--radius-md)',
              background: i % 2 === 0 ? 'var(--color-surface-bg)' : 'transparent',
              fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-normal)',
              color: 'var(--color-text-primary)',
            }}
          >
            <span style={{
              flexShrink: 0,
              width: 20, height: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '50%',
              background: 'var(--color-accent-subtle)', color: 'var(--color-accent)',
              fontSize: 10, fontWeight: 'var(--weight-semibold)',
            }}>
              {i + 1}
            </span>
            {item}
          </div>
        ))}
      </div>
    </div>
  ) : null;

  // ── Left column content (shared between desktop left and mobile info tab) ─

  const leftColumnContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {quotaBar}
      {infoGrid}
      {leftRichContent}
      {notesBlock}
    </div>
  );

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        display: 'flex',
        alignItems: isMobile ? 'flex-end' : 'center',
        justifyContent: 'center',
        padding: isMobile ? 0 : 'var(--space-4)',
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
          zIndex: 1,
          background: 'var(--color-white)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          ...dialogStyle,
        }}
      >
        {/* Drag handle on mobile */}
        {isMobile && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--color-surface-border)' }} />
          </div>
        )}

        {/* Header */}
        <div style={{
          padding: isMobile ? 'var(--space-3) var(--space-4)' : 'var(--space-5)',
          borderBottom: 'var(--border-subtle)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-3)',
          flexShrink: 0,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap', marginBottom: 'var(--space-2)' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '3px 10px', borderRadius: 'var(--radius-pill)',
                fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)',
                background: school.bg, color: school.color,
              }}>
                {school.name}
              </span>
              <Badge variant={status.variant} dot>{status.label}</Badge>
              {course.isNew && <Badge variant="accent">NEW</Badge>}
              {semesterStyle && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '3px 10px', borderRadius: 'var(--radius-pill)',
                  fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)',
                  background: semesterStyle.bg, color: semesterStyle.color,
                }}>
                  {course.semester}
                </span>
              )}
            </div>
            <h2 style={{
              margin: 0,
              fontSize: isMobile ? 'var(--text-lg)' : 'var(--text-xl)',
              fontWeight: 'var(--weight-bold)',
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

        {/* Mobile: tabs */}
        {showMobileTabs && (
          <div style={{
            display: 'flex', borderBottom: 'var(--border-subtle)',
            padding: '0 var(--space-4)',
            flexShrink: 0,
          }}>
            {(['info', 'outline'] as Tab[]).map((tab) => {
              const label = tab === 'info' ? '課程資訊' : '課程大綱';
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 'var(--text-sm)', fontWeight: activeTab === tab ? 'var(--weight-semibold)' : 'var(--weight-regular)',
                    color: activeTab === tab ? 'var(--color-accent)' : 'var(--color-text-muted)',
                    borderBottom: activeTab === tab ? '2px solid var(--color-accent)' : '2px solid transparent',
                    marginBottom: -1,
                    transition: 'color var(--dur-fast)',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {/* Body */}
        <div style={{
          padding: isMobile ? 'var(--space-4)' : 'var(--space-5)',
          overflowY: 'auto',
          flex: 1,
        }}>
          {isMobile ? (
            /* ── Mobile: tabbed or single column ── */
            showMobileTabs ? (
              activeTab === 'info' ? leftColumnContent : (
                detailLoading ? (
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 'var(--space-8)', color: 'var(--color-text-muted)',
                    fontSize: 'var(--text-sm)',
                  }}>
                    載入詳細資料中…
                  </div>
                ) : outlineBlock
              )
            ) : leftColumnContent
          ) : (
            /* ── Desktop ── */
            showTwoColumns ? (
              /* Two columns: left = info + text, right = outline */
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--space-8)',
                alignItems: 'start',
              }}>
                {leftColumnContent}
                <div style={{
                  borderLeft: 'var(--border-subtle)',
                  paddingLeft: 'var(--space-8)',
                }}>
                  {detailLoading ? (
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: 'var(--space-8)', color: 'var(--color-text-muted)',
                      fontSize: 'var(--text-sm)',
                    }}>
                      載入詳細資料中…
                    </div>
                  ) : outlineBlock}
                </div>
              </div>
            ) : (
              /* Single column: info + text only, no outline */
              leftColumnContent
            )
          )}
        </div>

        {/* Footer actions */}
        <div style={{
          padding: isMobile ? 'var(--space-3) var(--space-4)' : 'var(--space-4) var(--space-5)',
          borderTop: 'var(--border-subtle)',
          display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap',
          flexShrink: 0,
          paddingBottom: isMobile
            ? 'max(var(--space-6), env(safe-area-inset-bottom))'
            : 'var(--space-5)',
        }}>
          <Button
            variant={isFavorite ? 'accent' : 'surface'}
            size="md"
            onClick={() => onToggleFavorite(course.id)}
            style={{ flex: 1, minWidth: 100 }}
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
            style={{ flex: 1, minWidth: 100 }}
          >
            {isInCompare ? '比較中' : '加入比較'}
          </Button>

          <a
            href={course.detailUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => course.status === 'cancelled' && e.preventDefault()}
            style={{
              flex: 2, minWidth: 120,
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
