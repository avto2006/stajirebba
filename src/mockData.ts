import { Student, AnnouncementData } from './types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    firstName: 'ნიკოლოზ',
    lastName: 'ბერიძე',
    firstNameEn: 'Nikoloz',
    lastNameEn: 'Beridze',
    grade: 10,
    track: 'გაცვლითი პროგრამები',
    contact: '+995 599 11 22 33',
  },
  {
    id: 'std-2',
    firstName: 'ანა',
    lastName: 'კაპანაძე',
    firstNameEn: 'Ana',
    lastNameEn: 'Kapanadze',
    grade: 11,
    track: 'კინგსის ტიპის ოლიმპიადა',
    contact: '+995 598 22 33 44',
  },
  {
    id: 'std-3',
    firstName: 'გიორგი',
    lastName: 'მაისურაძე',
    firstNameEn: 'Giorgi',
    lastNameEn: 'Maisuradze',
    grade: 9,
    track: 'გაცვლითი პროგრამები',
    contact: '+995 577 33 44 55',
  },
  {
    id: 'std-4',
    firstName: 'მარიამ',
    lastName: 'გელაშვილი',
    firstNameEn: 'Mariam',
    lastNameEn: 'Gelashvili',
    grade: 12,
    track: 'გაცვლითი პროგრამები',
    contact: '+995 591 44 55 66',
  },
  {
    id: 'std-5',
    firstName: 'დავით',
    lastName: 'ლომიძე',
    firstNameEn: 'Davit',
    lastNameEn: 'Lomidze',
    grade: 8,
    track: 'კინგსის ტიპის ოლიმპიადა',
    contact: '+995 595 55 66 77',
  },
  {
    id: 'std-6',
    firstName: 'ელენე',
    lastName: 'ჯაფარიძე',
    firstNameEn: 'Elene',
    lastNameEn: 'Japaridze',
    grade: 10,
    track: 'კინგსის ტიპის ოლიმპიადა',
    contact: '+995 555 66 77 88',
  },
  {
    id: 'std-7',
    firstName: 'ლუკა',
    lastName: 'წიკლაური',
    firstNameEn: 'Luka',
    lastNameEn: 'Tsiklauri',
    grade: 11,
    track: 'გაცვლითი პროგრამები',
    contact: '+995 574 77 88 99',
  },
  {
    id: 'std-8',
    firstName: 'ნინო',
    lastName: 'ხუციშვილი',
    firstNameEn: 'Nino',
    lastNameEn: 'Khutsishvili',
    grade: 9,
    track: 'კინგსის ტიპის ოლიმპიადა',
    contact: '+995 593 88 99 00',
  },
  {
    id: 'std-9',
    firstName: 'სანდრო',
    lastName: 'დოლიძე',
    firstNameEn: 'Sandro',
    lastNameEn: 'Dolidze',
    grade: 12,
    track: 'კინგსის ტიპის ოლიმპიადა',
    contact: '+995 597 12 45 78',
  },
  {
    id: 'std-10',
    firstName: 'თამარ',
    lastName: 'მელიქიშვილი',
    firstNameEn: 'Tamar',
    lastNameEn: 'Melikishvili',
    grade: 8,
    track: 'გაცვლითი პროგრამები',
    contact: '+995 558 98 76 54',
  },
];

export interface QuickTemplate {
  id: string;
  title: string;
  template: string;
}

export const QUICK_TEMPLATES_KA: QuickTemplate[] = [
  {
    id: 'announcement',
    title: 'ღონისძიების ანონსი',
    template:
      'მოგესალმები {სახელი}! გაცნობებთ, რომ "ახალგაზრდა ლიდერთა აკადემიის" ორგანიზებით ტარდება ღონისძიება "{ღონისძიება}". თარიღი: {თარიღი}, დაწყების დრო: {დრო}. ადგილი/ფორმატი: {ადგილი}. გთხოვთ, მობრძანდეთ დროულად. წარმატებებს გისურვებთ!',
  },
  {
    id: 'reminder',
    title: 'შეხსენება',
    template:
      'გამარჯობა {სახელი}! შეგახსენებთ, რომ ღონისძიება "{ღონისძიება}" გაიმართება {თარიღი}-ს, {დრო} საათზე ({ადგილი}). გელით {მიმართულება} მიმართულების {კლასი}ს მოსწავლეებს!',
  },
  {
    id: 'olympiad',
    title: 'პროგრამა / ოლიმპიადა',
    template:
      'ძვირფასო {სახელი}! {მიმართულება} ფარგლებში დაგეგმილია მნიშვნელოვანი შეხვედრა: "{ღონისძიება}". გელით {თარიღი}-ს, {დრო}-ზე მისამართზე: {ადგილი}. წარმატებულ მონაწილეობას გისურვებთ!',
  },
];

export const QUICK_TEMPLATES_EN: QuickTemplate[] = [
  {
    id: 'announcement',
    title: 'Event Announcement',
    template:
      'Hello {firstName}! We are pleased to announce that the Young Leaders Academy is organizing the "{event}" event. Date: {date}, Start time: {time}. Location/Format: {location}. Please arrive on time. Best of luck!',
  },
  {
    id: 'reminder',
    title: 'Event Reminder',
    template:
      'Dear {firstName}! This is a friendly reminder that "{event}" will take place on {date} at {time} ({location}). We look forward to seeing {track} students from {grade}!',
  },
  {
    id: 'olympiad',
    title: 'Program / Olympiad',
    template:
      'Dear {firstName}! Within the {track} track, an important session is scheduled: "{event}". We look forward to seeing you on {date} at {time} at: {location}. Wishing you great success!',
  },
];

export const DEFAULT_ANNOUNCEMENT_KA: AnnouncementData = {
  eventName: 'ახალგაზრდული ლიდერობის ფორუმი 2026',
  date: '2026-11-28',
  time: '15:00',
  location: 'სამრეკლოს ქუჩა 26, Tbilisi, Georgia',
  template: QUICK_TEMPLATES_KA[0].template,
};

export const DEFAULT_ANNOUNCEMENT_EN: AnnouncementData = {
  eventName: 'Youth Leadership Forum 2026',
  date: '2026-11-28',
  time: '15:00',
  location: 'სამრეკლოს ქუჩა 26, Tbilisi, Georgia',
  template: QUICK_TEMPLATES_EN[0].template,
};

export const DEFAULT_ANNOUNCEMENT = DEFAULT_ANNOUNCEMENT_KA;
