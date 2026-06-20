import type { Course, CourseStatus, TimeSlot } from '@/types/course';
import type { BadgeProps } from '@/components/core/Badge';

export const SCHOOL_INFO: Record<string, { name: string; short: string; color: string; bg: string }> = {
  nangang:  { name: '南港社大', short: '南港', color: '#3e8a84', bg: '#c8e0de' },
  wenshan:  { name: '文山社大', short: '文山', color: '#5a9a6b', bg: '#cce5d4' },
  songshan: { name: '松山社大', short: '松山', color: '#9b7040', bg: '#edd9c0' },
  shilin:   { name: '士林社大', short: '士林', color: '#7b6ea6', bg: '#dddaf0' },
  beitou:   { name: '北投社大', short: '北投', color: '#c47a5a', bg: '#f5ddd0' },
};

export const DAY_LABELS = ['日', '一', '二', '三', '四', '五', '六'];

export const TIME_SLOT_LABELS: Record<TimeSlot, string> = {
  morning: '上午',
  afternoon: '下午',
  evening: '晚上',
};

export const STATUS_INFO: Record<CourseStatus, { label: string; variant: BadgeProps['variant'] }> = {
  open:      { label: '開放報名', variant: 'success' },
  full:      { label: '名額已滿', variant: 'error' },
  cancelled: { label: '已取消',   variant: 'neutral' },
  delayed:   { label: '延後開課', variant: 'warning' },
};

export const DISCOUNT_MAP: Record<string, number> = {
  '九折': 0.9, '八折': 0.8, '七折': 0.7,
  '六折': 0.6, '五折': 0.5, '四折': 0.4,
};

export function getSchoolInfo(school: string) {
  return SCHOOL_INFO[school] ?? { name: school, short: school, color: '#6e6c69', bg: '#e6e4e1' };
}

export function formatFee(fee: number, discount?: string | null): string {
  if (fee === 0) return '免費';
  const base = `NT$ ${fee.toLocaleString()}`;
  if (!discount || !DISCOUNT_MAP[discount]) return base;
  const discounted = Math.round(fee * DISCOUNT_MAP[discount]);
  return `NT$ ${discounted.toLocaleString()}`;
}

export function formatOriginalFee(fee: number): string {
  return `NT$ ${fee.toLocaleString()}`;
}

export function formatDaySlot(dayOfWeek: number, timeSlot: TimeSlot): string {
  return `每週${DAY_LABELS[dayOfWeek]} ${TIME_SLOT_LABELS[timeSlot]}`;
}

export function getUniqueValues<K extends keyof Course>(courses: Course[], key: K): Course[K][] {
  const seen = new Set<string>();
  const result: Course[K][] = [];
  for (const c of courses) {
    const v = c[key];
    const str = String(v);
    if (!seen.has(str)) { seen.add(str); result.push(v); }
  }
  return result;
}

export function getUniqueCategories(courses: Course[]): string[] {
  return [...new Set(courses.map((c) => c.category))].sort();
}

export function getUniqueSchools(courses: Course[]): string[] {
  return [...new Set(courses.map((c) => c.school))];
}

/** Returns set of course IDs that have a time conflict (same dayOfWeek + timeSlot as another). */
export function detectConflicts(courses: Course[]): Set<string> {
  const slotMap = new Map<string, string[]>();
  for (const c of courses) {
    const key = `${c.dayOfWeek}_${c.timeSlot}`;
    const group = slotMap.get(key) ?? [];
    group.push(c.id);
    slotMap.set(key, group);
  }
  const conflicting = new Set<string>();
  for (const ids of slotMap.values()) {
    if (ids.length > 1) ids.forEach((id) => conflicting.add(id));
  }
  return conflicting;
}
