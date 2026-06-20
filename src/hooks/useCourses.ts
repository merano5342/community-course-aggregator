import { useQuery } from '@tanstack/react-query';
import type { Course, TimeSlot } from '@/types/course';
import { SCHOOL_INFO } from '@/lib/courseUtils';
import { MOCK_COURSES } from '@/data/mockCourses';

// frog.tw base URLs — needed to construct detailUrl
const FROG_BASE: Record<string, string> = {
  nangang:    'https://nangang.frog.tw',
  songshan:   'https://ss.twcc.org.tw',
  wenshan:    'https://wenshan.wenshan.org.tw',
  beitou:     'https://bt.btcc.org.tw',
  wanhua:     'https://whcc.twcu.org.tw',
  xinyi:      'https://xy.twcu.org.tw',
  zhongzheng: 'https://zzcc.twcc.org.tw',
  zhongshan:  'https://zscc.twcu.org.tw',
};

const DAY_MAP: Record<string, number> = { 日: 0, 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6 };

function parseSchedule(schedule: string): { dayOfWeek: number; timeSlot: TimeSlot } {
  const dayMatch = schedule.match(/[（(]([日一二三四五六])[）)]/);
  const dayOfWeek = dayMatch ? (DAY_MAP[dayMatch[1]] ?? 0) : 0;
  const timeMatch = schedule.match(/(\d{1,2}):\d{2}/);
  const hour = timeMatch ? parseInt(timeMatch[1], 10) : 0;
  const timeSlot: TimeSlot = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  return { dayOfWeek, timeSlot };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeScrapedCourse(raw: any, school: string): Course {
  const schedule: string = raw.schedule ?? '';
  const { dayOfWeek, timeSlot } = parseSchedule(schedule);
  const quota: number | undefined = raw.quota ?? undefined;
  const enrolled: number | undefined = raw.enrolled ?? undefined;
  const uHash: string = raw.uHash ?? '';
  const base = FROG_BASE[school] ?? '';

  // WeeklyTopic[] → string[]
  const outline: string[] | undefined = Array.isArray(raw.outline)
    ? raw.outline.map((t: { week: string; topic: string; content?: string }) =>
        t.content ? `${t.week}｜${t.topic}｜${t.content}` : `${t.week}｜${t.topic}`,
      )
    : undefined;

  return {
    id: raw.id ?? `${school}_${uHash}`,
    school,
    name: raw.name ?? '',
    teacher: raw.teacher ? [raw.teacher as string] : [],
    category: raw.category ?? '其他',
    dayOfWeek,
    timeSlot,
    startDate: raw.startDate ?? '',
    location: raw.location ?? '',
    fee: 0,
    status: quota != null && enrolled != null && enrolled >= quota ? 'full' : 'open',
    isNew: false,
    isMixed: false,
    detailUrl: uHash ? `${base}/course/m_course_detail.php?u=${uHash}` : base,
    quota,
    enrolled,
    description: raw.description ?? undefined,
    outline,
    targetAudience: raw.targetAudience ?? undefined,
    teacherBio: raw.teacherBio ?? undefined,
    notes: raw.notes ?? undefined,
  };
}

async function fetchSchoolCourses(school: string): Promise<Course[]> {
  const url = `${import.meta.env.BASE_URL}data/courses/${school}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${school}: HTTP ${res.status}`);
  const raw = await res.json();
  return (raw as unknown[]).map((c) => normalizeScrapedCourse(c, school));
}

async function fetchAllCourses(schools: string[]): Promise<Course[]> {
  const results = await Promise.allSettled(schools.map(fetchSchoolCourses));
  return results
    .filter((r): r is PromiseFulfilledResult<Course[]> => r.status === 'fulfilled')
    .flatMap((r) => r.value);
}

export function useCourses(schools?: string[]): {
  courses: Course[];
  isLoading: boolean;
  error: Error | null;
} {
  const schoolList = schools ?? Object.keys(SCHOOL_INFO);

  const query = useQuery<Course[], Error>({
    queryKey: ['courses', schoolList],
    queryFn: () => fetchAllCourses(schoolList),
    staleTime: 1000 * 60 * 60,   // treat as fresh for 1 hour
    retry: 1,
  });

  // Fall back to mock data when no real data is available (dev / first deploy)
  const courses = query.data && query.data.length > 0 ? query.data : MOCK_COURSES;

  return {
    courses,
    isLoading: query.isLoading,
    error: query.error,
  };
}
