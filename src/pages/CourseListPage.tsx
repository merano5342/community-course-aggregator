import { useState, useMemo } from 'react';
import type { Course } from '@/types/course';
import { useCourses } from '@/hooks/useCourses';
import { useFavoritesStore } from '@/stores/useFavoritesStore';
import { useCompareStore } from '@/stores/useCompareStore';
import { Input } from '@/components/core/Input';
import { CourseCard } from '@/components/courses/CourseCard';
import { CourseDetailModal } from '@/components/courses/CourseDetailModal';
import { FilterSidebar, DEFAULT_FILTERS } from '@/components/courses/FilterSidebar';
import type { FilterState } from '@/components/courses/FilterSidebar';
import { getUniqueCategories, getUniqueSchools } from '@/lib/courseUtils';

export function CourseListPage() {
  const { courses, isLoading } = useCourses();
  const favorites = useFavoritesStore();
  const compare = useCompareStore();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const availableSchools = useMemo(() => getUniqueSchools(courses), [courses]);
  const availableCategories = useMemo(() => getUniqueCategories(courses), [courses]);

  const filtered = useMemo(() => {
    let result = [...courses];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (c) => c.name.toLowerCase().includes(q) || c.teacher.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (filters.schools.length > 0) result = result.filter((c) => filters.schools.includes(c.school));
    if (filters.days.length > 0) result = result.filter((c) => filters.days.includes(c.dayOfWeek));
    if (filters.timeSlots.length > 0) result = result.filter((c) => filters.timeSlots.includes(c.timeSlot));
    if (filters.categories.length > 0) result = result.filter((c) => filters.categories.includes(c.category));
    if (filters.statuses.length > 0) result = result.filter((c) => filters.statuses.includes(c.status));
    if (filters.onlyNew) result = result.filter((c) => c.isNew);
    if (filters.onlyMixed) result = result.filter((c) => c.isMixed);

    switch (filters.sortBy) {
      case 'fee-asc': return result.sort((a, b) => a.fee - b.fee);
      case 'fee-desc': return result.sort((a, b) => b.fee - a.fee);
      case 'school': return result.sort((a, b) => a.school.localeCompare(b.school));
      default: return result.sort((a, b) => a.startDate.localeCompare(b.startDate));
    }
  }, [courses, filters]);

  const handleToggleCompare = (id: string) => {
    const ok = compare.toggle(id);
    if (!ok) {
      // could show a toast here; for now the button is disabled
    }
    return ok;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', paddingBottom: 80 }}>
      {/* Search bar */}
      <div style={{ maxWidth: 560 }}>
        <Input
          placeholder="搜尋課程名稱或老師…"
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          prefix={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          }
          suffix={
            filters.search ? (
              <button
                onClick={() => setFilters((f) => ({ ...f, search: '' }))}
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

      {/* Result count */}
      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
        {isLoading ? '載入中…' : `共找到 ${filtered.length} 門課程`}
      </div>

      {/* Main content */}
      <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'flex-start' }}>
        {/* Filter sidebar */}
        <FilterSidebar
          filters={filters}
          onChange={setFilters}
          availableSchools={availableSchools}
          availableCategories={availableCategories}
        />

        {/* Course grid */}
        <div style={{ flex: 1 }}>
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
                onClick={() => setFilters(DEFAULT_FILTERS)}
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
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 'var(--card-gap)',
            }}>
              {filtered.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isFavorite={favorites.has(course.id)}
                  isInCompare={compare.has(course.id)}
                  isCompareFull={compare.isFull()}
                  onViewDetail={setSelectedCourse}
                  onToggleFavorite={favorites.toggle}
                  onToggleCompare={handleToggleCompare}
                />
              ))}
            </div>
          )}
        </div>
      </div>

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
