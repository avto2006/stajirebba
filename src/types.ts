export type TrackType = 'გაცვლითი პროგრამები' | 'კინგსის ტიპის ოლიმპიადა';

export type GradeType = 8 | 9 | 10 | 11 | 12;

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  firstNameEn?: string;
  lastNameEn?: string;
  grade: GradeType;
  track: TrackType;
  contact: string;
}

export interface AnnouncementData {
  eventName: string;
  date: string;
  time: string;
  location: string;
  template: string;
}

export interface SentMessage {
  studentId: string;
  studentName: string;
  studentNameEn?: string;
  grade: GradeType;
  track: TrackType;
  contact: string;
  renderedText: string;
}

export interface BroadcastHistoryItem {
  id: string;
  eventName: string;
  sentAt: string;
  recipientCount: number;
  status: 'წარმატებით გაიგზავნა';
  messages: SentMessage[];
  announcementData: AnnouncementData;
}
