import type { CourseStatus, TimeSlot } from '@/types/course';

export interface FilterState {
  search: string;
  semesters: string[];
  schools: string[];
  days: number[];
  timeSlots: TimeSlot[];
  categories: string[];
  statuses: CourseStatus[];
  onlyNew: boolean;
  excludeSpring: boolean;
  sortBy: 'date' | 'fee-asc' | 'fee-desc' | 'school';
}

export const DEFAULT_FILTERS: FilterState = {
  search: '', semesters: [], schools: [], days: [], timeSlots: ['evening'],
  categories: [], statuses: [], onlyNew: false, excludeSpring: true, sortBy: 'date',
};
