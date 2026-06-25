import { useState, useMemo } from 'react';
import type { Course } from '@/types/course';
import { useCourses } from '@/hooks/useCourses';
import { useFavoritesStore } from '@/stores/useFavoritesStore';
import { useCompareStore } from '@/stores/useCompareStore';
import { useFilterStore } from '@/stores/useFilterStore';
import { useSchoolOrderStore } from '@/stores/useSchoolOrderStore';
import { useIsMobile } from '@/hooks/useIsMobile';
import { Input } from '@/components/core/Input';
import { CourseCard } from '@/components/courses/CourseCard';
import { CourseDetailModal } from '@/components/courses/CourseDetailModal';
import { FilterSidebar } from '@/components/courses/FilterSidebar';
import { DEFAULT_FILTERS } from '@/components/courses/filterState';
import { getUniqueCategories, getUniqueSchools, getUniqueSemesters, normalizeSchoolOrder, applySchoolOrder } from '@/lib/courseUtils';

export function CourseListPage() {
  const { courses, isLoading } = useCourses();
  const favorites = useFavoritesStore();
  const compare = useCompareStore();
  const { filters, setFilters, reset: resetFilters } = useFilterStore();
  const { schoolOrder } = useSchoolOrderStore();
  const isMobile = useIsMobile();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const normalizedSchoolOrder = useMemo(() => normalizeSchoolOrder(schoolOrder), [schoolOrder]);
  const availableSchools = useMemo(
    () => applySchoolOrder(getUniqueSchools(courses), normalizedSchoolOrder),
    [courses, normalizedSchoolOrder],
  );
  const availableCategories = useMemo(() => getUniqueCategories(courses), [courses]);
  const availableSemesters = useMemo(() => getUniqueSemesters(courses), [courses]);

  const filtered = useMemo(() => {
    let result = [...courses];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (c) => c.name.toLowerCase().includes(q) || c.teacher.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (filters.excludeSpring) result = result.filter((c) => !c.semester?.includes('春'));
    if (filters.semesters.length > 0) result = result.filter((c) => c.semester != null && filters.semesters.includes(c.semester));
    if (filters.schools.length > 0) result = result.filter((c) => filters.schools.includes(c.school));
    if (filters.days.length > 0) result = result.filter((c) => filters.days.includes(c.dayOfWeek));
    if (filters.timeSlots.length > 0) result = result.filter((c) => filters.timeSlots.includes(c.timeSlot));
    if (filters.categories.length > 0) result = result.filter((c) => filters.categories.includes(c.category));
    if (filters.statuses.length > 0) result = result.filter((c) => filters.statuses.includes(c.status));
    if (filters.onlyNew) result = result.filter((c) => c.isNew);

    switch (filters.sortBy) {
      case 'fee-asc': return result.sort((a, b) => a.fee - b.fee);
      case 'fee-desc': return result.sort((a, b) => b.fee - a.fee);
      case 'school': return result.sort((a, b) => {
        const ai = normalizedSchoolOrder.indexOf(a.school);
        const bi = normalizedSchoolOrder.indexOf(b.school);
        return (ai === -1 ? 9999 : ai) - (bi === -1 ? 9999 : bi);
      });
      default: return result.sort((a, b) => a.startDate.localeCompare(b.startDate));
    }
  }, [courses, filters, normalizedSchoolOrder]);

  const handleToggleCompare = (id: string) => {
    return compare.toggle(id);
  };

  const defaultTimeSlots = [...DEFAULT_FILTERS.timeSlots].sort().join(',');
  const activeFilterCount = [
    filters.semesters.length > 0,
    filters.schools.length > 0,
    filters.days.length > 0,
    [...filters.timeSlots].sort().join(',') !== defaultTimeSlots,
    filters.categories.length > 0,
    filters.statuses.length > 0,
    filters.onlyNew,
    !filters.excludeSpring,
    filters.search.trim() !== '',
  ].filter(Boolean).length;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', paddingBottom: 60,
      marginTop: isMobile ? 'calc(-1 * var(--space-4))' : 'calc(-1 * var(--space-6))',
    }}>
      {/* Search bar + mobile filter toggle */}
      <div style={{
        position: 'sticky', top: 'calc(var(--header-height) - 20px)', zIndex: 5,
        background: 'var(--color-surface-bg)',
        paddingTop: 'var(--space-3)', paddingBottom: 'var(--space-3)',
      }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <div style={{ flex: 1, maxWidth: isMobile ? '100%' : 720 }}>
            <Input
              placeholder="搜尋課程名稱或老師…"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              prefix={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              }
              suffix={
                filters.search ? (
                  <button
                    onClick={() => setFilters({ ...filters, search: '' })}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--color-text-muted)' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                ) : undefined
              }
            />
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={() => resetFilters()}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '0 12px', height: 40, flexShrink: 0,
                border: 'var(--border-medium)', borderRadius: 'var(--radius-md)',
                background: 'var(--color-white)', cursor: 'pointer',
                fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)',
                color: 'var(--color-text-secondary)',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              清除篩選
            </button>
          )}
          {isMobile && (
            <button
              onClick={() => setShowMobileFilter(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '0 14px', height: 40, flexShrink: 0,
                border: activeFilterCount > 0 ? '1.5px solid var(--color-accent)' : 'var(--border-medium)',
                borderRadius: 'var(--radius-md)', background: activeFilterCount > 0 ? 'var(--color-accent-subtle)' : 'var(--color-white)',
                cursor: 'pointer', fontSize: 'var(--text-sm)',
                color: activeFilterCount > 0 ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                fontWeight: 'var(--weight-medium)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
              </svg>
              篩選{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </button>
          )}
        </div>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', paddingTop: 'var(--space-1)' }}>
          {isLoading ? '載入中…' : `共找到 ${filtered.length} 門課程`}
        </div>
      </div>

      {/* Main content */}
      <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'flex-start' }}>
        {/* Desktop filter sidebar */}
        {!isMobile && (
          <div style={{
            position: 'sticky',
            top: 'calc(var(--header-height) + 92px)',
            alignSelf: 'flex-start',
            maxHeight: 'calc(100vh - var(--header-height) - 92px - var(--space-6))',
            overflowY: 'auto',
            flexShrink: 0,
          }}>
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              availableSchools={availableSchools}
              availableCategories={availableCategories}
              availableSemesters={availableSemesters}
            />
          </div>
        )}

        {/* Course grid */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {isLoading ? (
            <div style={{ color: 'var(--color-text-muted)', padding: 'var(--space-7) 0', textAlign: 'center' }}>
              載入中…
            </div>
          ) : filtered.length === 0 ? (
            <div style={{
              padding: 'var(--space-8) var(--space-6)', textAlign: 'center',
              background: 'var(--color-white)', borderRadius: 'var(--radius-xl)',
            }}>
              <div style={{ fontSize: 40, marginBottom: 'var(--space-3)' }}>🔍</div>
              <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-2)' }}>
                找不到符合條件的課程
              </div>
              <div style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
                試試調整篩選條件或清除搜尋關鍵字
              </div>
              <button
                onClick={() => resetFilters()}
                style={{
                  padding: '8px 20px', background: 'var(--color-accent)', color: 'white',
                  border: 'none', borderRadius: 'var(--radius-pill)', cursor: 'pointer',
                  fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)',
                }}
              >
                清除全部篩選
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: isMobile ? 6 : 'var(--card-gap)',
            }}>
              {filtered.map((course, i) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isFavorite={favorites.has(course.id)}
                  isInCompare={compare.has(course.id)}
                  isCompareFull={compare.isFull()}
                  onViewDetail={setSelectedCourse}
                  onToggleFavorite={favorites.toggle}
                  onToggleCompare={handleToggleCompare}
                  compact={isMobile}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {isMobile && showMobileFilter && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 500 }}
          onClick={() => setShowMobileFilter(false)}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
          <div
            style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: '85%', maxWidth: 320,
              background: 'var(--color-surface-bg)',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: 'var(--space-4)', borderBottom: 'var(--border-subtle)',
            }}>
              <span style={{ fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-base)' }}>篩選</span>
              <button
                onClick={() => setShowMobileFilter(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div style={{ padding: 'var(--space-2) 0' }}>
              <FilterSidebar
                filters={filters}
                onChange={(f) => { setFilters(f); }}
                availableSchools={availableSchools}
                availableCategories={availableCategories}
                availableSemesters={availableSemesters}
                embedded
              />
            </div>
            <div style={{ padding: 'var(--space-4)', borderTop: 'var(--border-subtle)' }}>
              <button
                onClick={() => setShowMobileFilter(false)}
                style={{
                  width: '100%', padding: '10px', background: 'var(--color-accent)',
                  color: 'white', border: 'none', borderRadius: 'var(--radius-md)',
                  fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-base)', cursor: 'pointer',
                }}
              >
                套用篩選（{filtered.length} 門）
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Detail Modal */}
      {selectedCourse && (
        <CourseDetailModal
          course={selectedCourse}
          isFavorite={favorites.has(selectedCourse.id)}
          isInCompare={compare.has(selectedCourse.id)}
          isCompareFull={compare.isFull()}
          onClose={() => setSelectedCourse(null)}
          onToggleFavorite={favorites.toggle}
          onToggleCompare={handleToggleCompare}
        />
      )}
    </div>
  );
}
