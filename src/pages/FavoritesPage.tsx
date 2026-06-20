import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Course } from '@/types/course';
import { useFavoritesStore } from '@/stores/useFavoritesStore';
import { useCompareStore } from '@/stores/useCompareStore';
import { useCourses } from '@/hooks/useCourses';
import { CourseDetailModal } from '@/components/courses/CourseDetailModal';
import { Badge } from '@/components/core/Badge';
import {
  getSchoolInfo, STATUS_INFO, detectConflicts, formatFee, formatDaySlot, DISCOUNT_MAP,
  DAY_LABELS, TIME_SLOT_LABELS,
} from '@/lib/courseUtils';

export function FavoritesPage() {
  const favorites = useFavoritesStore();
  const compare = useCompareStore();
  const { courses: allCourses } = useCourses();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const favCourses = favorites.ids
    .map((id) => allCourses.find((c) => c.id === id))
    .filter((c): c is Course => !!c);

  const conflictIds = detectConflicts(favCourses);

  if (favCourses.length === 0) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: 400, gap: 'var(--space-4)',
      }}>
        <div style={{ fontSize: 48 }}>💙</div>
        <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-semibold)' }}>還沒有收藏課程</div>
        <div style={{ color: 'var(--color-text-muted)' }}>在課程列表頁點擊愛心圖示即可加入最愛</div>
        <Link
          to="/"
          style={{
            padding: '10px 24px', background: 'var(--color-accent)', color: 'white',
            borderRadius: 'var(--radius-pill)', textDecoration: 'none',
            fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-sm)',
          }}
        >
          前往瀏覽課程
        </Link>
      </div>
    );
  }

  const conflictGroups: Record<string, string[]> = {};
  for (const c of favCourses) {
    if (conflictIds.has(c.id)) {
      const key = `${c.dayOfWeek}_${c.timeSlot}`;
      conflictGroups[key] = [...(conflictGroups[key] ?? []), c.name];
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: 720 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)' }}>我的最愛</h1>
          <p style={{ margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
            共收藏 {favCourses.length} 門課程
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Link
            to="/schedule"
            style={{
              padding: '7px 14px', background: 'var(--color-surface-card)', borderRadius: 'var(--radius-md)',
              textDecoration: 'none', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            週曆視圖
          </Link>
          <button
            onClick={favorites.clear}
            style={{
              padding: '7px 14px', background: 'none', border: 'var(--border-medium)',
              borderRadius: 'var(--radius-md)', cursor: 'pointer',
              fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)',
            }}
          >
            清空全部
          </button>
        </div>
      </div>

      {/* Conflict warning */}
      {conflictIds.size > 0 && (
        <div style={{
          background: 'var(--color-warning-subtle)',
          border: '1px solid var(--color-warning)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-3) var(--space-4)',
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-sm)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning)" strokeWidth="2" strokeLinecap="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            偵測到時段衝堂
          </div>
          {Object.entries(conflictGroups).map(([key, names]) => {
            const [day, slot] = key.split('_');
            return (
              <div key={key} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                每週{DAY_LABELS[Number(day)]} {TIME_SLOT_LABELS[slot as keyof typeof TIME_SLOT_LABELS]}：{names.join('、')}
              </div>
            );
          })}
        </div>
      )}

      {/* Course list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {favCourses.map((course) => {
          const school = getSchoolInfo(course.school);
          const status = STATUS_INFO[course.status];
          const hasConflict = conflictIds.has(course.id);
          const hasDiscount = !!course.discount && !!DISCOUNT_MAP[course.discount];

          return (
            <div
              key={course.id}
              style={{
                background: 'var(--color-white)',
                borderRadius: 'var(--radius-lg)',
                border: hasConflict ? '1.5px solid var(--color-warning)' : 'var(--border-subtle)',
                padding: 'var(--space-3) var(--space-4)',
                display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
              }}
            >
              {/* Drag handle (visual) */}
              <span style={{ color: 'var(--color-text-muted)', cursor: 'grab', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
              </span>

              {/* Info */}
              <div
                style={{ flex: 1, cursor: 'pointer', minWidth: 0 }}
                onClick={() => setSelectedCourse(course)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                  <span style={{
                    padding: '2px 8px', borderRadius: 'var(--radius-pill)',
                    fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)',
                    background: school.bg, color: school.color,
                  }}>{school.short}</span>
                  <Badge variant={status.variant}>{status.label}</Badge>
                  {hasConflict && (
                    <span style={{
                      fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)',
                      color: 'var(--color-warning)',
                      display: 'flex', alignItems: 'center', gap: 3,
                    }}>
                      ⚠ 衝堂
                    </span>
                  )}
                </div>
                <div style={{
                  fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)',
                  color: 'var(--color-text-primary)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {course.name}
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                  {formatDaySlot(course.dayOfWeek, course.timeSlot)} · {formatFee(course.fee, course.discount)}
                  {hasDiscount && <span style={{ color: 'var(--color-error)', marginLeft: 4, fontSize: 'var(--text-xs)' }}>{course.discount}</span>}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexShrink: 0 }}>
                <button
                  onClick={() => compare.toggle(course.id)}
                  title={compare.has(course.id) ? '移除比較' : compare.isFull() ? '比較清單已滿' : '加入比較'}
                  disabled={!compare.has(course.id) && compare.isFull()}
                  style={{
                    width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                    background: compare.has(course.id) ? 'var(--color-accent-subtle)' : 'var(--color-surface-card)',
                    color: compare.has(course.id) ? 'var(--color-accent)' : 'var(--color-text-muted)',
                    opacity: (!compare.has(course.id) && compare.isFull()) ? 0.4 : 1,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                </button>
                <button
                  onClick={() => favorites.remove(course.id)}
                  title="移除收藏"
                  style={{
                    width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                    background: 'var(--color-error-subtle)', color: 'var(--color-error)',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedCourse && (
        <CourseDetailModal
          course={selectedCourse}
          isFavorite={favorites.has(selectedCourse.id)}
          isInCompare={compare.has(selectedCourse.id)}
          isCompareFull={compare.isFull()}
          onClose={() => setSelectedCourse(null)}
          onToggleFavorite={favorites.toggle}
          onToggleCompare={(id) => compare.toggle(id)}
        />
      )}
    </div>
  );
}
