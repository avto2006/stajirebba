import { Student, AnnouncementData, SentMessage } from './types';

export function renderTemplate(
  template: string,
  student: Student,
  announcement: AnnouncementData
): string {
  let result = template;
  result = result.replaceAll('{სახელი}', student.firstName || '');
  result = result.replaceAll('{გვარი}', student.lastName || '');
  result = result.replaceAll('{სრული სახელი}', `${student.firstName} ${student.lastName}`.trim());
  result = result.replaceAll('{კლასი}', student.grade ? `${student.grade}-ე კლასი` : '');
  result = result.replaceAll('{მიმართულება}', student.track || '');
  result = result.replaceAll('{ღონისძიება}', announcement.eventName || '');
  result = result.replaceAll('{თარიღი}', announcement.date || '');
  result = result.replaceAll('{დრო}', announcement.time || '');
  result = result.replaceAll('{ადგილი}', announcement.location || '');
  return result;
}

export function exportToTxt(historyItemTitle: string, messages: SentMessage[]) {
  const header = `==========================================================\nახალგაზრდა ლიდერთა აკადემია - შეტყობინებების რეესტრი\nღონისძიება: ${historyItemTitle}\nსულ ადრესატი: ${messages.length}\nექსპორტის დრო: ${new Date().toLocaleString('ka-GE')}\n==========================================================\n\n`;

  const body = messages
    .map(
      (m, idx) =>
        `#${idx + 1} ადრესატი: ${m.studentName} (${m.grade}-ე კლასი | ${m.track})\nკონტაქტი: ${m.contact}\nტექსტი:\n${m.renderedText}\n----------------------------------------------------------`
    )
    .join('\n\n');

  const fullContent = header + body;
  const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ALA_${historyItemTitle.replace(/\s+/g, '_')}_შეტყობინებები.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportToCsv(historyItemTitle: string, messages: SentMessage[]) {
  // UTF-8 BOM so Excel opens Georgian characters correctly without encoding issues
  const BOM = '\uFEFF';
  const csvHeaders = ['№', 'მოსწავლე', 'კლასი', 'მიმართულება', 'კონტაქტი', 'შეტყობინების ტექსტი'];

  const rows = messages.map((m, idx) => [
    (idx + 1).toString(),
    `"${m.studentName.replace(/"/g, '""')}"`,
    `"${m.grade}-ე კლასი"`,
    `"${m.track.replace(/"/g, '""')}"`,
    `"${m.contact.replace(/"/g, '""')}"`,
    `"${m.renderedText.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
  ]);

  const csvContent =
    BOM +
    [csvHeaders.join(','), ...rows.map((row) => row.join(','))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ALA_${historyItemTitle.replace(/\s+/g, '_')}_შეტყობინებები.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
