import { Student, AnnouncementData, SentMessage } from './types';
import { Language } from './translations';

const GEO_TO_LAT_MAP: Record<string, string> = {
  'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e', 'ვ': 'v', 'ზ': 'z',
  'თ': 't', 'ი': 'i', 'კ': 'k', 'ლ': 'l', 'მ': 'm', 'ნ': 'n', 'ო': 'o',
  'პ': 'p', 'ჟ': 'zh', 'რ': 'r', 'ს': 's', 'ტ': 't', 'უ': 'u', 'ფ': 'p',
  'ქ': 'k', 'ღ': 'gh', 'ყ': 'k', 'შ': 'sh', 'ჩ': 'ch', 'ც': 'ts', 'ძ': 'dz',
  'წ': 'ts', 'ჭ': 'ch', 'ხ': 'kh', 'ჯ': 'j', 'ჰ': 'h'
};

export function georgianToLatin(text: string): string {
  if (!text) return '';
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const lat = GEO_TO_LAT_MAP[char];
    if (lat !== undefined) {
      // Capitalize first letter of words
      if (i === 0 || text[i - 1] === ' ') {
        result += lat.charAt(0).toUpperCase() + lat.slice(1);
      } else {
        result += lat;
      }
    } else {
      result += char;
    }
  }
  return result;
}

export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [, year, month, day] = match;
    return `${day}.${month}.${year}`;
  }
  return dateStr;
}

export function formatDisplayTime(timeStr: string): string {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  if (parts.length >= 2) {
    return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
  }
  return timeStr;
}

export function formatDisplayDateTime(dateStr: string, timeStr: string): string {
  const d = formatDisplayDate(dateStr);
  const t = formatDisplayTime(timeStr);
  if (d && t) return `${d} • ${t}`;
  return d || t || '';
}

export function formatSentAt(date: Date = new Date()): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}.${month}.${year} • ${hours}:${minutes}`;
}

export function getStudentDisplayName(
  student: Student,
  lang: Language
): {
  firstName: string;
  lastName: string;
  fullName: string;
  initials: string;
} {
  if (lang === 'en') {
    const fn = student.firstNameEn || georgianToLatin(student.firstName);
    const ln = student.lastNameEn || georgianToLatin(student.lastName);
    const inits = `${fn[0] || ''}${ln[0] || ''}`.toUpperCase();
    return {
      firstName: fn,
      lastName: ln,
      fullName: `${fn} ${ln}`.trim(),
      initials: inits,
    };
  }

  const fn = student.firstName;
  const ln = student.lastName;
  const inits = `${fn[0] || ''}${ln[0] || ''}`;
  return {
    firstName: fn,
    lastName: ln,
    fullName: `${fn} ${ln}`.trim(),
    initials: inits,
  };
}

export function renderTemplate(
  template: string,
  student: Student,
  announcement: AnnouncementData,
  lang: Language = 'ka'
): string {
  let result = template;
  const names = getStudentDisplayName(student, lang);

  const gradeText = student.grade
    ? lang === 'ka'
      ? `${student.grade}-ე კლასი`
      : `Grade ${student.grade}`
    : '';

  const trackText =
    lang === 'en'
      ? student.track === 'გაცვლითი პროგრამები'
        ? 'Exchange Programs'
        : 'Kings-Style Olympiad'
      : student.track;

  const formattedDate = formatDisplayDate(announcement.date);
  const formattedTime = formatDisplayTime(announcement.time);

  // Georgian tags
  result = result.replaceAll('{სახელი}', names.firstName);
  result = result.replaceAll('{გვარი}', names.lastName);
  result = result.replaceAll('{სრული სახელი}', names.fullName);
  result = result.replaceAll('{კლასი}', gradeText);
  result = result.replaceAll('{მიმართულება}', trackText || '');
  result = result.replaceAll('{ღონისძიება}', announcement.eventName || '');
  result = result.replaceAll('{თარიღი}', formattedDate || announcement.date || '');
  result = result.replaceAll('{დრო}', formattedTime || announcement.time || '');
  result = result.replaceAll('{ადგილი}', announcement.location || '');

  // English tags
  result = result.replaceAll('{firstName}', names.firstName);
  result = result.replaceAll('{lastName}', names.lastName);
  result = result.replaceAll('{fullName}', names.fullName);
  result = result.replaceAll('{grade}', gradeText);
  result = result.replaceAll('{track}', trackText || '');
  result = result.replaceAll('{event}', announcement.eventName || '');
  result = result.replaceAll('{date}', formattedDate || announcement.date || '');
  result = result.replaceAll('{time}', formattedTime || announcement.time || '');
  result = result.replaceAll('{location}', announcement.location || '');

  return result;
}

export function exportToTxt(historyItemTitle: string, messages: SentMessage[], lang: Language = 'ka') {
  const isKa = lang === 'ka';
  const header = `==========================================================\n${
    isKa ? 'ახალგაზრდა ლიდერთა აკადემია - შეტყობინებების რეესტრი' : 'Young Leaders Academy - Messages Registry'
  }\n${isKa ? 'ღონისძიება' : 'Event'}: ${historyItemTitle}\n${
    isKa ? 'სულ ადრესატი' : 'Total Recipients'
  }: ${messages.length}\n${
    isKa ? 'ექსპორტის დრო' : 'Exported At'
  }: ${new Date().toLocaleString(isKa ? 'ka-GE' : 'en-US')}\n==========================================================\n\n`;

  const body = messages
    .map(
      (m, idx) => {
        const studentName = isKa ? m.studentName : (m.studentNameEn || m.studentName);
        const trackName = isKa
          ? m.track
          : m.track === 'გაცვლითი პროგრამები'
          ? 'Exchange Programs'
          : 'Kings-Style Olympiad';
        return `#${idx + 1} ${isKa ? 'ადრესატი' : 'Recipient'}: ${studentName} (${m.grade}-${isKa ? 'ე კლასი' : 'th Grade'} | ${trackName})\n${
          isKa ? 'კონტაქტი' : 'Contact'
        }: ${m.contact}\n${isKa ? 'ტექსტი' : 'Text'}:\n${m.renderedText}\n----------------------------------------------------------`;
      }
    )
    .join('\n\n');

  const fullContent = header + body;
  const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ALA_${historyItemTitle.replace(/\s+/g, '_')}_${isKa ? 'შეტყობინებები' : 'messages'}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportToCsv(historyItemTitle: string, messages: SentMessage[], lang: Language = 'ka') {
  const isKa = lang === 'ka';
  // UTF-8 BOM so Excel opens Georgian & international characters correctly without encoding issues
  const BOM = '\uFEFF';
  const csvHeaders = isKa
    ? ['№', 'მოსწავლე', 'კლასი', 'მიმართულება', 'კონტაქტი', 'შეტყობინების ტექსტი']
    : ['No', 'Student', 'Grade', 'Track', 'Contact', 'Message Content'];

  const rows = messages.map((m, idx) => {
    const studentName = isKa ? m.studentName : (m.studentNameEn || m.studentName);
    const trackName = isKa
      ? m.track
      : m.track === 'გაცვლითი პროგრამები'
      ? 'Exchange Programs'
      : 'Kings-Style Olympiad';
    return [
      (idx + 1).toString(),
      `"${studentName.replace(/"/g, '""')}"`,
      `"${m.grade}-${isKa ? 'ე კლასი' : 'th Grade'}"`,
      `"${trackName.replace(/"/g, '""')}"`,
      `"${m.contact.replace(/"/g, '""')}"`,
      `"${m.renderedText.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    ];
  });

  const csvContent =
    BOM +
    [csvHeaders.join(','), ...rows.map((row) => row.join(','))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ALA_${historyItemTitle.replace(/\s+/g, '_')}_${isKa ? 'შეტყობინებები' : 'messages'}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
