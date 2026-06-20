import { useQuery } from '@tanstack/react-query';
import type { Course } from '@/types/course';
import { SCHOOL_INFO } from '@/lib/courseUtils';
import { MOCK_COURSES } from '@/data/mockCourses';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeScrapedCourse(raw: any, school: string): Course {
  const base = FROG_BASE[school] ?? '';
  const uHash: string = raw.uHash ?? '';

  // Scraper already provides dayOfWeek and timeSlot directly
  const dayOfWeek: number = raw.dayOfWeek ?? 0;
  const timeSlot = (raw.timeSlot ?? 'evening') as Course['timeSlot'];

  // imageUrl: prepend school base URL if it's a relative path
  let imageUrl: string | undefined = raw.imageUrl ?? undefined;
  if (imageUrl && !imageUrl.startsWith('http')) {
    imageUrl = `${base}/course/${imageUrl}`;
  }

  // outline: scraper returns {week, topic, content}[] → flatten to string[]
  const rawOutline = raw.outline as Array<{ week: string; topic: string; content?: string }> | undefined;
  const outline: string[] | undefined = rawOutline?.map((t) =>
    t.content ? `${t.week}｜${t.topic}｜${t.content}` : `${t.week}｜${t.topic}`,
  );

  // location: use specific location if available, fall back to area
  const location: string = raw.location ?? raw.area ?? '';

  return {
    id: raw.id ?? `${school}_${uHash}`,
    school,
    name: raw.name ?? '',
    teacher: raw.teacher ? [raw.teacher as string] : [],
    category: raw.category ?? '其他',
    dayOfWeek,
    timeSlot,
    startDate: raw.startDate ?? '',
    location,
    fee: raw.fee ?? 0,
    status: (raw.status ?? 'open') as Course['status'],
    weeks: raw.weeks ?? undefined,
    isNew: false,
    isMixed: raw.isMixed ?? false,
    detailUrl: uHash ? `${base}/course/m_course_detail.php?u=${uHash}` : base,
    imageUrl,
    quota: raw.quota ?? undefined,
    enrolled: raw.enrolled ?? undefined,
    description: raw.description ?? undefined,
    outline,
    targetAudience: raw.targetAudience ?? undefined,
    teacherBio: raw.teacherBio ?? undefined,
    notes: raw.notes ?? undefined,
    semester: raw.semester ?? undefined,
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
    staleTime: 1000 * 60 * 60,
    retry: 1,
  });

  // Fall back to mock data in dev when no JSON files exist yet
  const courses = query.data && query.data.length > 0 ? query.data : MOCK_COURSES;

  return {
    courses,
    isLoading: query.isLoading,
    error: query.error,
  };
}
