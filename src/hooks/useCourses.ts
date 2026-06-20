import { MOCK_COURSES } from '@/data/mockCourses';
import type { Course } from '@/types/course';

// When real scraped data is available, replace this with TanStack Query fetching
// from https://cdn.jsdelivr.net/gh/{repo}/data/courses/{school}.json
export function useCourses(): { courses: Course[]; isLoading: boolean; error: null } {
  return { courses: MOCK_COURSES, isLoading: false, error: null };
}
