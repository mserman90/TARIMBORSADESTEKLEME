import type { AgriSupport } from './types';

const MONTH_MAP: Record<string, number> = {
  'ocak': 0, 'şubat': 1, 'subat': 1, 'mart': 2, 'nisan': 3, 'mayıs': 4, 'mayis': 4,
  'haziran': 5, 'temmuz': 6, 'ağustos': 7, 'agustos': 7, 'eylül': 8, 'eylul': 8,
  'ekim': 9, 'kasım': 10, 'kasim': 10, 'aralık': 11, 'aralik': 11,
};

export function parseTurkishDate(text: string): Date | null {
  if (!text) return null;
  const lower = text.toLowerCase().trim();

  if (lower === 'sürekli' || lower.includes('ilan edilecek') || lower.includes('tamamlandı')) {
    return null;
  }

  const match = lower.match(/(\d{1,2})\s*([a-zçğıöşü]+)\s*(\d{4})/);
  if (match) {
    const day = parseInt(match[1], 10);
    const monthName = match[2];
    const year = parseInt(match[3], 10);
    const month = MONTH_MAP[monthName];
    if (month !== undefined) return new Date(year, month, day);
  }

  const monthOnly = lower.match(/([a-zçğıöşü]+)\s*(\d{4})/);
  if (monthOnly) {
    const month = MONTH_MAP[monthOnly[1]];
    if (month !== undefined) return new Date(parseInt(monthOnly[2], 10), month, 1);
  }

  return null;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function toICSDate(date: Date): string {
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
}

function escapeICS(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

export interface CalendarEventInfo {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  url?: string | null;
}

function buildEventInfo(s: AgriSupport): CalendarEventInfo | null {
  const startDate = parseTurkishDate(s.application_start || '');
  const endDate = parseTurkishDate(s.application_end || '');

  let eventStart: Date;
  let eventEnd: Date;

  if (startDate && endDate) {
    eventStart = startDate;
    eventEnd = new Date(endDate);
    eventEnd.setDate(eventEnd.getDate() + 1);
  } else if (startDate) {
    eventStart = startDate;
    eventEnd = new Date(startDate);
    eventEnd.setDate(eventEnd.getDate() + 1);
  } else if (endDate) {
    eventStart = new Date(endDate);
    eventEnd = new Date(eventStart);
    eventEnd.setDate(eventEnd.getDate() + 1);
  } else {
    return null;
  }

  const description = [
    s.summary,
    s.description ? `\n${s.description}` : '',
    `\nKurum: ${s.agency}`,
    s.application_start ? `\nBaşvuru başlangıcı: ${s.application_start}` : '',
    s.application_end ? `\nSon başvuru: ${s.application_end}` : '',
    s.application_method ? `\nBaşvuru yöntemi: ${s.application_method}` : '',
    s.eligibility?.length ? `\nUygunluk: ${s.eligibility.join('; ')}` : '',
    s.official_url ? `\n${s.official_url}` : '',
  ].join('');

  return {
    title: `${s.title} — Başvuru Dönemi`,
    description,
    startDate: eventStart,
    endDate: eventEnd,
    allDay: true,
    url: s.official_url,
  };
}

export function generateICS(support: AgriSupport): string {
  const info = buildEventInfo(support);
  if (!info) return '';

  const dtStart = toICSDate(info.startDate);
  const dtEnd = toICSDate(info.endDate);
  const uid = `${support.id}@tarim-destek`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Tarim Destek//Calendar Export//TR',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART;VALUE=DATE:${dtStart}`,
    `DTEND;VALUE=DATE:${dtEnd}`,
    `SUMMARY:${escapeICS(info.title)}`,
    `DESCRIPTION:${escapeICS(info.description)}`,
    info.url ? `URL:${info.url}` : '',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeICS(info.title)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n');
}

export function downloadICS(support: AgriSupport) {
  const ics = generateICS(support);
  if (!ics) return;
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${support.slug || 'destek'}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function getGoogleCalendarUrl(support: AgriSupport): string | null {
  const info = buildEventInfo(support);
  if (!info) return null;

  const start = toICSDate(info.startDate);
  const end = toICSDate(info.endDate);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: info.title,
    dates: `${start}/${end}`,
    details: info.description,
  });
  if (info.url) params.set('url', info.url);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
