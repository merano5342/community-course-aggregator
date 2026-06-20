import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Course } from '@/types/course';
import { useCompareStore } from '@/stores/useCompareStore';
import { useFavoritesStore } from '@/stores/useFavoritesStore';
import { useCourses } from '@/hooks/useCourses';
import { CourseDetailModal } from '@/components/courses/CourseDetailModal';
import {
  getSchoolInfo, STATUS_INFO, DAY_LABELS, TIME_SLOT_LABELS,
  formatFee, formatOriginalFee, DISCOUNT_MAP,
} from '@/lib/courseUtils';
import { Badge } from '@/components/core/Badge';

const COMPARE_ROWS: { key: keyof Course | '_fee' | '_day'; label: string }[] = [
  { key: 'school', label: '學校' },
  { key: 'category', label: '課程類別' },
  { key: '_fee', label: '學分費' },
  { key: 'dayOfWeek', label: '上課星期' },
  { key: 'timeSlot', label: '上課時段' },
  { key: 'startDate', label: '開課日期' },
  { key: 'weeks', label: '總週數' },
  { key: 'location', label: '上課地點' },
  { key: 'status', label: '名額狀態' },
  { key: 'isMixed', label: '混成課程' },
  { key: 'isNew', label: '新課程' },
];

function getCellValue(course: Course, key: string): string {
  switch (key) {
    case 'school': return getSchoolInfo(course.school).name;
    case '_fee': {
      const hasD = !!course.discount && !!DISCOUNT_MAP[course.discount];
      return hasD
        ? `${formatFee(course.fee, course.discount)}（${course.discount}）`
        : formatOriginalFee(course.fee);
    }
    case 'dayOfWeek': return `每週${DAY_LABELS[course.dayOfWeek]}`;
    case 'timeSlot': return TIME_SLOT_LABELS[course.timeSlot];
    case 'startDate': return new Date(course.startDate).toLocaleDateString('zh-TW');
    case 'weeks': return course.weeks ? `${course.weeks} 週` : '—';
    case 'status': return STATUS_INFO[course.status].label;
    case 'isMixed': return course.isMixed ? '是' : '否';
    case 'isNew': return course.isNew ? '是' : '否';
    default: return String((course as unknown as Record<string, unknown>)[key] ?? '—');
  }
}

function isDifferent(courses: Course[], key: string): boolean {
  if (courses.length <= 1) return false;
  const vals = courses.map((c) => getCellValue(c, key));
  return new Set(vals).size > 1;
}

export function ComparePage() {
  const { ids, remove, clear } = useCompareStore();
  const favorites = useFavoritesStore();
  const compare = useCompareStore();
  const { courses: allCourses } = useCourses();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const courses = ids.map((id) => allCourses.find((c) => c.id === id)).filter((c): c is Course => !!c);

  if (courses.length === 0) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: 400, gap: 'var(--space-4)',
      }}>
        <div style={{ fontSize: 48 }}>📊</div>
        <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-semibold)' }}>比較清單是空的</div>
        <div style={{ color: 'var(--color-text-muted)' }}>在課程列表頁點擊「比較」按鈕即可加入</div>
        <Link
          to="/"
          style={{
            padding: '10px 24px', background: 'var(--color-accent)', color: 'white',
            borderRadius: 'var(--radius-pill)', textDecoration: 'none',
            fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-sm)',
          }}
        >
          返回課程列表
        </Link>
      </div>
    );
  }

  const colWidth = `${Math.floor(100 / (courses.length + 1))}%`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)' }}>跨校比較</h1>
          <p style={{ margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
            最多可比較 3 門課程・差異欄位以底色標示
          </p>
        </div>
        <button
          onClick={clear}
          style={{
            padding: '6px 16px', background: 'var(--color-surface-card)', border: 'none',
            borderRadius: 'var(--radius-md)', cursor: 'pointer',
            fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)',
          }}
        >
          清除全部
        </button>
      </div>

      {/* Compare table */}
      <div style={{
        background: 'var(--color-white)', borderRadius: 'var(--radius-xl)',
        overflow: 'hidden', border: 'var(--border-subtle)',
      }}>
        {/* Course header row */}
        <div style={{ display: 'flex', borderBottom: '2px solid var(--color-surface-border)' }}>
          <div style={{ width: colWidth, padding: 'var(--space-4)', flexShrink: 0 }} />
          {courses.map((course) => {
            const school = getSchoolInfo(course.school);
            const status = STATUS_INFO[course.status];
            return (
              <div
                key={course.id}
                style={{
                  flex: 1, padding: 'var(--space-4)', borderLeft: 'var(--border-subtle)',
                  display: 'flex', flexDirection: 'column', gap: 'var(--space-2)',
                }}
              >
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{
                    display: 'inline-block', padding: '2px 8px', borderRadius: 'var(--radius-pill)',
                    fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)',
                    background: school.bg, color: school.color,
                  }}>{school.short}</span>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
                <button
                  onClick={() => setSelectedCourse(course)}
                  style={{
                    background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer',
                    fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)',
                    color: 'var(--color-text-primary)', lineHeight: 'var(--leading-snug)',
                  }}
                >
                  {course.name}
                </button>
                <button
                  onClick={() => remove(course.id)}
                  style={{
                    alignSelf: 'flex-start', background: 'none', border: 'none',
                    cursor: 'pointer', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)',
                    padding: '2px 0', display: 'flex', alignItems: 'center', gap: 4,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                  移除
                </button>
              </div>
            );
          })}
          {courses.length < 3 && (
            <div style={{
              flex: 1, borderLeft: 'var(--border-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 'var(--space-5)',
            }}>
              <Link
                to="/"
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  color: 'var(--color-text-muted)', textDecoration: 'none',
                  padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)',
                  border: '1.5px dashed var(--color-surface-border)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
                新增課程
              </Link>
            </div>
          )}
        </div>

        {/* Data rows */}
        {COMPARE_ROWS.map(({ key, label }, i) => {
          const diff = isDifferent(courses, key);
          return (
            <div
              key={key}
              style={{
                display: 'flex',
                background: diff ? 'var(--color-warning-subtle)' : (i % 2 === 0 ? 'transparent' : 'var(--color-surface-bg)'),
                borderBottom: 'var(--border-subtle)',
              }}
            >
              <div style={{
                width: colWidth, flexShrink: 0,
                padding: 'var(--space-3) var(--space-4)',
                fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)',
                color: 'var(--color-text-secondary)',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                {diff && <span style={{ color: 'var(--color-warning)', fontSize: 10 }}>●</span>}
                {label}
              </div>
              {courses.map((course) => (
                <div
                  key={course.id}
                  style={{
                    flex: 1, padding: 'var(--space-3) var(--space-4)',
                    borderLeft: 'var(--border-subtle)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: diff ? 'var(--weight-semibold)' : 'var(--weight-regular)',
                    color: 'var(--color-text-primary)',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  {getCellValue(course, key)}
                </div>
              ))}
              {courses.length < 3 && <div style={{ flex: 1, borderLeft: 'var(--border-subtle)' }} />}
            </div>
          );
        })}

        {/* Footer actions */}
        <div style={{ display: 'flex', borderTop: '2px solid var(--color-surface-border)' }}>
          <div style={{ width: colWidth, flexShrink: 0 }} />
          {courses.map((course) => (
            <div key={course.id} style={{
              flex: 1, padding: 'var(--space-4)', borderLeft: 'var(--border-subtle)',
              display: 'flex', flexDirection: 'column', gap: 'var(--space-2)',
            }}>
              <a
                href={course.detailUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '8px', background: 'var(--color-accent)', color: 'white',
                  borderRadius: 'var(--radius-md)', textDecoration: 'none',
                  fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)',
                  opacity: course.status === 'cancelled' ? 0.45 : 1,
                  pointerEvents: course.status === 'cancelled' ? 'none' : 'auto',
                }}
              >
                前往報名 ↗
              </a>
              <button
                onClick={() => favorites.toggle(course.id)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '8px', background: favorites.has(course.id) ? 'var(--color-error-subtle)' : 'var(--color-surface-card)',
                  color: favorites.has(course.id) ? 'var(--color-error)' : 'var(--color-text-secondary)',
                  border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                }}
              >
                {favorites.has(course.id) ? '♥ 已收藏' : '♡ 收藏'}
              </button>
            </div>
          ))}
          {courses.length < 3 && <div style={{ flex: 1, borderLeft: 'var(--border-subtle)' }} />}
        </div>
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
