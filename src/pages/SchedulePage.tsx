import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Course, TimeSlot } from '@/types/course';
import { useFavoritesStore } from '@/stores/useFavoritesStore';
import { useCompareStore } from '@/stores/useCompareStore';
import { useCourses } from '@/hooks/useCourses';
import { CourseDetailModal } from '@/components/courses/CourseDetailModal';
import { getSchoolInfo, DAY_LABELS, TIME_SLOT_LABELS, detectConflicts } from '@/lib/courseUtils';

const TIME_SLOTS: TimeSlot[] = ['morning', 'afternoon', 'evening'];
const DAYS = [0, 1, 2, 3, 4, 5, 6];

export function SchedulePage() {
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
        <div style={{ fontSize: 48 }}>🗓</div>
        <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-semibold)' }}>時間表是空的</div>
        <div style={{ color: 'var(--color-text-muted)' }}>收藏課程後即可在此查看時段分布</div>
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

  // Build slot map: slotKey → Course[]
  const slotMap = new Map<string, Course[]>();
  for (const c of favCourses) {
    const key = `${c.dayOfWeek}_${c.timeSlot}`;
    slotMap.set(key, [...(slotMap.get(key) ?? []), c]);
  }

  // Collect schools with colors for legend
  const usedSchools = [...new Set(favCourses.map((c) => c.school))];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)' }}>時間表</h1>
          <p style={{ margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
            顯示我的最愛（{favCourses.length} 門課）
          </p>
        </div>
        <Link
          to="/favorites"
          style={{
            padding: '7px 14px', background: 'var(--color-surface-card)', borderRadius: 'var(--radius-md)',
            textDecoration: 'none', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          管理最愛
        </Link>
      </div>

      {/* Conflict warning */}
      {conflictIds.size > 0 && (
        <div style={{
          background: 'var(--color-warning-subtle)', border: '1px solid var(--color-warning)',
          borderRadius: 'var(--radius-lg)', padding: 'var(--space-3) var(--space-4)',
          fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning)" strokeWidth="2" strokeLinecap="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          有 {conflictIds.size} 門課程時段衝堂，請確認後再報名
        </div>
      )}

      {/* Weekly grid */}
      <div style={{
        background: 'var(--color-white)', borderRadius: 'var(--radius-xl)',
        overflow: 'hidden', border: 'var(--border-subtle)',
      }}>
        {/* Day headers */}
        <div style={{
          display: 'grid', gridTemplateColumns: '72px repeat(7, 1fr)',
          background: 'var(--color-dark)', color: 'var(--color-text-on-dark)',
        }}>
          <div style={{ padding: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)' }}>
            時段
          </div>
          {DAYS.map((d) => (
            <div key={d} style={{
              padding: 'var(--space-3)', textAlign: 'center',
              fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)',
              borderLeft: '1px solid rgba(255,255,255,0.07)',
            }}>
              {DAY_LABELS[d]}
            </div>
          ))}
        </div>

        {/* Time slot rows */}
        {TIME_SLOTS.map((slot, si) => (
          <div
            key={slot}
            style={{
              display: 'grid', gridTemplateColumns: '72px repeat(7, 1fr)',
              borderTop: si > 0 ? 'var(--border-subtle)' : 'none',
              minHeight: 80,
            }}
          >
            {/* Time label */}
            <div style={{
              padding: 'var(--space-3)', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: 'var(--color-surface-card)',
              fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)',
              color: 'var(--color-text-muted)', gap: 2,
            }}>
              {TIME_SLOT_LABELS[slot]}
            </div>

            {/* Day cells */}
            {DAYS.map((day) => {
              const key = `${day}_${slot}`;
              const cells = slotMap.get(key) ?? [];
              const hasConflict = cells.length > 1;

              return (
                <div
                  key={day}
                  style={{
                    borderLeft: 'var(--border-subtle)',
                    padding: 4,
                    display: 'flex', flexDirection: 'column', gap: 3,
                    background: hasConflict ? 'var(--color-warning-subtle)' : 'transparent',
                  }}
                >
                  {cells.map((course) => {
                    const school = getSchoolInfo(course.school);
                    const isConflict = conflictIds.has(course.id);
                    return (
                      <button
                        key={course.id}
                        onClick={() => setSelectedCourse(course)}
                        title={`${course.name}（${school.name}）`}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left',
                          padding: '4px 6px', border: 'none',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          background: school.bg,
                          color: school.color,
                          borderLeft: `3px solid ${school.color}`,
                          outline: isConflict ? `2px solid var(--color-warning)` : 'none',
                          outlineOffset: 1,
                          lineHeight: 'var(--leading-snug)',
                        }}
                      >
                        <div style={{
                          fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {course.name}
                        </div>
                        <div style={{ fontSize: 10, opacity: 0.75 }}>{school.short}</div>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', padding: 'var(--space-1) 0' }}>
        {usedSchools.map((s) => {
          const info = getSchoolInfo(s);
          return (
            <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)' }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: info.color, flexShrink: 0 }} />
              {info.name}
            </span>
          );
        })}
        {conflictIds.size > 0 && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)', color: 'var(--color-warning)' }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--color-warning-subtle)', border: '1px solid var(--color-warning)', flexShrink: 0 }} />
            衝堂
          </span>
        )}
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
