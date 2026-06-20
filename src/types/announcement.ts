export type AnnouncementType = 'registration' | 'schedule' | 'cancel' | 'venue' | 'general';

export interface Announcement {
  id: string;
  school: string;  // school id, or 'all' for platform-wide
  type: AnnouncementType;
  title: string;
  content: string;
  date: string;    // ISO date
  important?: boolean;
  link?: string;
}

export interface SemesterInfo {
  name: string;
  registrationStart: string;
  registrationEnd: string;
  semesterStart: string;
  semesterEnd: string;
}
