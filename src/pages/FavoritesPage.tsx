import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Course } from '@/types/course';
import { useFavoritesStore } from '@/stores/useFavoritesStore';
import { useCompareStore } from '@/stores/useCompareStore';
import { useSchoolOrderStore } from '@/stores/useSchoolOrderStore';
import { useCourses } from '@/hooks/useCourses';
import { CourseDetailModal } from '@/components/courses/CourseDetailModal';
import { Badge } from '@/components/core/Badge';
import {
  getSchoolInfo, STATUS_INFO, detectConflicts, formatFee, formatDaySlot, DISCOUNT_MAP,
  DAY_LABELS, TIME_SLOT_LABELS, SCHOOL_INFO, normalizeSchoolOrder,
} from '@/lib/courseUtils';

export function FavoritesPage() {
  const favorites = useFavoritesStore();
  const compare = useCompareStore();
  const { schoolOrder, setOrder, reset: resetOrder } = useSchoolOrderStore();
  const { courses: allCourses, isRealData } = useCourses();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showSchoolOrder, setShowSchoolOrder] = useState(false);

  // Remove stale favorite IDs (e.g. from mock data) once real course data is available.
  useEffect(() => {
    if (!isRealData) return;
    favorites.ids
      .filter((id) => !allCourses.some((c) => c.id === id))
      .forEach((id) => favorites.remove(id));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRealData]);

  const normalizedOrder = useMemo(() => normalizeSchoolOrder(schoolOrder), [schoolOrder]);

  const favCourses = useMemo(() =>
    favorites.ids
      .map((id) => allCourses.find((c) => c.id === id))
      .filter((c): c is Course => !!c)
      .sort((a, b) => {
        const ai = normalizedOrder.indexOf(a.school);
        const bi = normalizedOrder.indexOf(b.school);
        return (ai === -1 ? 9999 : ai) - (bi === -1 ? 9999 : bi);
      }),
  [favorites.ids, allCourses, normalizedOrder]);

  const conflictIds = detectConflicts(favCourses);

  const conflictGroups: Record<string, string[]> = {};
  for (const c of favCourses) {
    if (conflictIds.has(c.id)) {
      const key = `${c.dayOfWeek}_${c.timeSlot}`;
      conflictGroups[key] = [...(conflictGroups[key] ?? []), c.name];
    }
  }

  const defaultOrder = Object.keys(SCHOOL_INFO);
  const isDefaultOrder = normalizedOrder.join(',') === defaultOrder.join(',');

  function moveSchool(key: string, dir: -1 | 1) {
    const idx = normalizedOrder.indexOf(key);
    const next = [...normalizedOrder];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setOrder(next);
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
          {favCourses.length > 0 && (
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
          )}
        </div>
      </div>

      {/* School order panel */}
      <div style={{
        background: 'var(--color-white)',
        borderRadius: 'var(--radius-lg)',
        border: 'var(--border-subtle)',
        overflow: 'hidden',
      }}>
        <button
          onClick={() => setShowSchoolOrder((v) => !v)}
          style={{
            width: '100%', padding: '12px var(--space-4)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'none', border: 'none', cursor: 'pointer',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
              <path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>
            </svg>
            學校排序偏好
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {!isDefaultOrder && (
              <span
                role="button"
                onClick={(e) => { e.stopPropagation(); resetOrder(); }}
                style={{
                  fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)',
                  textDecoration: 'underline', cursor: 'pointer',
                }}
              >
                重置
              </span>
            )}
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              style={{ transform: showSchoolOrder ? 'rotate(180deg)' : 'none', transition: 'transform 120ms' }}
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </button>

        {showSchoolOrder && (
          <div style={{
            borderTop: 'var(--border-subtle)',
            padding: 'var(--space-3) var(--space-4)',
            display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            <p style={{ margin: '0 0 8px', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              拖拉順序影響課程列表的學校篩選排列，以及此頁面的課程分組順序。
            </p>
            {normalizedOrder.map((key, idx) => {
              const info = getSchoolInfo(key);
              return (
                <div
                  key={key}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '6px 10px', borderRadius: 'var(--radius-md)',
                    background: 'var(--color-surface-card)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center',
                      padding: '2px 8px', borderRadius: 'var(--radius-pill)',
                      fontSize: 12, fontWeight: 'var(--weight-semibold)',
                      background: info.bg, color: info.color,
                    }}>
                      {info.short}
                    </span>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                      {info.name}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                    <button
                      disabled={idx === 0}
                      onClick={() => moveSchool(key, -1)}
                      style={{
                        width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: 'none', borderRadius: 'var(--radius-sm)',
                        background: 'transparent', cursor: idx === 0 ? 'not-allowed' : 'pointer',
                        color: 'var(--color-text-muted)', opacity: idx === 0 ? 0.3 : 1,
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="18 15 12 9 6 15"/>
                      </svg>
                    </button>
                    <button
                      disabled={idx === normalizedOrder.length - 1}
                      onClick={() => moveSchool(key, 1)}
                      style={{
                        width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: 'none', borderRadius: 'var(--radius-sm)',
                        background: 'transparent', cursor: idx === normalizedOrder.length - 1 ? 'not-allowed' : 'pointer',
                        color: 'var(--color-text-muted)', opacity: idx === normalizedOrder.length - 1 ? 0.3 : 1,
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Empty state */}
      {favCourses.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: 300, gap: 'var(--space-4)',
        }}>
          <div style={{ fontSize: 48 }}>💙</div>
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-semibold)' }}>還沒有收藏課程</div>
          <div style={{ color: 'var(--color-text-muted)' }}>在課程列表頁點擊愛心圖示即可加入最愛</div>
          <Link
            to="/courses"
            style={{
              padding: '10px 24px', background: 'var(--color-accent)', color: 'white',
              borderRadius: 'var(--radius-pill)', textDecoration: 'none',
              fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-sm)',
            }}
          >
            前往瀏覽課程
          </Link>
        </div>
      ) : (
        <>
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
        </>
      )}

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
