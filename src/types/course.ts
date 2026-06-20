export type TimeSlot = 'morning' | 'afternoon' | 'evening';

export type CourseStatus = 'open' | 'full' | 'cancelled' | 'delayed';

export interface Course {
  /** hash from URL query param u=xxxxx */
  id: string;
  school: string;
  name: string;
  teacher: string[];
  category: string;
  /** 0=日、1=一 … 6=六 */
  dayOfWeek: number;
  timeSlot: TimeSlot;
  /** ISO date string */
  startDate: string;
  location: string;
  /** 學分費（元），0 = 免費 */
  fee: number;
  discount?: string | null;
  status: CourseStatus;
  weeks?: number;
  isNew: boolean;
  isMixed: boolean;
  detailUrl: string;
  imageUrl?: string;
}
