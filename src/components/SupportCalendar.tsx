import { useState, useMemo } from 'react';
import { AgriSupport, STATUS_COLORS, STATUS_LABELS } from '@/lib/types';
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
} from 'lucide-react';

const MONTHS_TR = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

const MONTH_MAP: Record<string, number> = {
  'ocak': 0, 'şubat': 1, 'subat': 1, 'mart': 2, 'nisan': 3, 'mayıs': 4, 'mayis': 4,
  'haziran': 5, 'temmuz': 6, 'ağustos': 7, 'agustos': 7, 'eylül': 8, 'eylul': 8,
  'ekim': 9, 'kasım': 10, 'kasim': 10, 'aralık': 11, 'aralik': 11,
};

interface CalendarEvent {
  date: Date;
  support: AgriSupport;
  type: 'start' | 'end';
  label: string;
}

function parseTurkishDate(text: string): Date | null {
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
    if (month !== undefined) {
      return new Date(year, month, day);
    }
  }

  const monthOnly = lower.match(/([a-zçğıöşü]+)\s*(\d{4})/);
  if (monthOnly) {
    const monthName = monthOnly[1];
    const year = parseInt(monthOnly[2], 10);
    const month = MONTH_MAP[monthName];
    if (month !== undefined) {
      return new Date(year, month, 1);
    }
  }

  const yearOnly = lower.match(/^(\d{4})$/);
  if (yearOnly) {
    return new Date(parseInt(yearOnly[1], 10), 0, 1);
  }

  return null;
}

function buildEvents(supports: AgriSupport[]): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  for (const s of supports) {
    const startDate = parseTurkishDate(s.application_start || '');
    if (startDate) {
      events.push({
        date: startDate,
        support: s,
        type: 'start',
        label: `${s.title} — Başlangıç`,
      });
    }

    const endDate = parseTurkishDate(s.application_end || '');
    if (endDate) {
      events.push({
        date: endDate,
        support: s,
        type: 'end',
        label: `${s.title} — Son Başvuru`,
      });
    }
  }

  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

const WEEKDAYS = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'];

export function SupportCalendar({ supports }: { supports: AgriSupport[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 8, 1)); // September 2026
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const events = useMemo(() => buildEvents(supports), [supports]);

  const eventsByDay = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const e of events) {
      const key = `${e.date.getFullYear()}-${e.date.getMonth()}-${e.date.getDate()}`;
      if (!map[key]) map[key] = [];
      map[key].push(e);
    }
    return map;
  }, [events]);

  const monthEvents = useMemo(
    () => events.filter((e) => isSameMonth(e.date, currentMonth)),
    [events, currentMonth]
  );

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return events.filter((e) => e.date >= now).slice(0, 8);
  }, [events]);

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let startWeekday = firstDay.getDay() - 1;
    if (startWeekday < 0) startWeekday = 6;

    const days: (Date | null)[] = [];
    for (let i = 0; i < startWeekday; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
    while (days.length % 7 !== 0) days.push(null);

    return days;
  }, [currentMonth]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedDayEvents = selectedDate
    ? eventsByDay[`${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`] || []
    : [];

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const goToday = () => {
    const now = new Date();
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(now);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* Calendar grid */}
      <div className="lg:col-span-3 bg-white rounded-xl border border-stone-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-stone-800 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-green-600" />
            {MONTHS_TR[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={goToday}
              className="px-2.5 py-1 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-100 transition-colors mr-1"
            >
              Bugün
            </button>
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-stone-600" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-stone-600" />
            </button>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-center text-xs font-medium text-stone-400 py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, i) => {
            if (!day) return <div key={i} className="h-12" />;
            const key = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
            const dayEvents = eventsByDay[key] || [];
            const isToday = isSameDay(day, today);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const hasEvents = dayEvents.length > 0;

            return (
              <button
                key={i}
                onClick={() => setSelectedDate(day)}
                className={`h-12 rounded-lg flex flex-col items-center justify-center text-sm transition-all relative ${
                  isSelected
                    ? 'bg-green-700 text-white font-bold'
                    : hasEvents
                    ? 'bg-green-50 text-green-800 font-medium hover:bg-green-100'
                    : 'text-stone-600 hover:bg-stone-50'
                } ${isToday && !isSelected ? 'ring-1 ring-green-500' : ''}`}
              >
                <span>{day.getDate()}</span>
                {hasEvents && !isSelected && (
                  <div className="flex gap-0.5 mt-0.5">
                    {dayEvents.slice(0, 3).map((e, idx) => (
                      <span
                        key={idx}
                        className={`w-1 h-1 rounded-full ${
                          e.support.status === 'active'
                            ? 'bg-green-500'
                            : e.support.status === 'upcoming'
                            ? 'bg-amber-500'
                            : 'bg-stone-400'
                        }`}
                      />
                    ))}
                  </div>
                )}
                {hasEvents && isSelected && (
                  <span className="text-[10px] leading-none mt-0.5">{dayEvents.length}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected day events */}
        {selectedDate && (
          <div className="mt-4 pt-4 border-t border-stone-100">
            <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">
              {selectedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </h4>
            {selectedDayEvents.length > 0 ? (
              <div className="space-y-2">
                {selectedDayEvents.map((e, idx) => {
                  const StatusIcon = e.support.status === 'active' ? CheckCircle2 : e.support.status === 'upcoming' ? Clock : XCircle;
                  return (
                    <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-stone-50">
                      <StatusIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        e.support.status === 'active' ? 'text-green-600' : e.support.status === 'upcoming' ? 'text-amber-600' : 'text-stone-400'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-stone-800">{e.support.title}</div>
                        <div className="text-xs text-stone-500">
                          {e.type === 'start' ? 'Başvuru başlangıcı' : 'Son başvuru tarihi'}
                          {' · '}{e.support.agency}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-stone-400 py-2">Bu tarihte önemli bir tarih yok</p>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Aktif
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Yaklaşan
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-stone-400"></span>
            Kapandı
          </div>
        </div>
      </div>

      {/* Upcoming events sidebar */}
      <div className="lg:col-span-2 space-y-4">
        {/* This month's events */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <h3 className="font-bold text-stone-800 text-sm mb-3">
            {MONTHS_TR[currentMonth.getMonth()]} ayındaki tarihler
          </h3>
          {monthEvents.length > 0 ? (
            <div className="space-y-2">
              {monthEvents.map((e, idx) => {
                const StatusIcon = e.support.status === 'active' ? CheckCircle2 : e.support.status === 'upcoming' ? Clock : XCircle;
                return (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div className="flex-shrink-0 w-10 text-center">
                      <div className="text-lg font-bold text-stone-800 leading-none">{e.date.getDate()}</div>
                      <div className="text-[10px] text-stone-400 uppercase">
                        {MONTHS_TR[e.date.getMonth()].slice(0, 3)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 pb-2 border-b border-stone-50 last:border-0">
                      <div className="text-sm font-medium text-stone-800 truncate">{e.support.title}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <StatusIcon className={`w-3 h-3 ${
                          e.support.status === 'active' ? 'text-green-600' : e.support.status === 'upcoming' ? 'text-amber-600' : 'text-stone-400'
                        }`} />
                        <span className="text-xs text-stone-500">
                          {e.type === 'start' ? 'Başlangıç' : 'Son başvuru'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-stone-400 py-4 text-center">Bu ay önemli tarih yok</p>
          )}
        </div>

        {/* Upcoming timeline */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <h3 className="font-bold text-stone-800 text-sm mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            Yaklaşan tarihler
          </h3>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-2">
              {upcomingEvents.map((e, idx) => {
                const daysUntil = Math.ceil((e.date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div className="flex-shrink-0 w-10 text-center">
                      <div className="text-lg font-bold text-stone-800 leading-none">{e.date.getDate()}</div>
                      <div className="text-[10px] text-stone-400 uppercase">
                        {MONTHS_TR[e.date.getMonth()].slice(0, 3)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 pb-2 border-b border-stone-50 last:border-0">
                      <div className="text-sm font-medium text-stone-800 truncate">{e.support.title}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-xs font-medium ${
                          daysUntil <= 7 ? 'text-red-600' : daysUntil <= 30 ? 'text-amber-600' : 'text-stone-500'
                        }`}>
                          {daysUntil === 0 ? 'Bugün!' : `${daysUntil} gün kaldı`}
                        </span>
                        <span className="text-xs text-stone-400">·</span>
                        <span className="text-xs text-stone-500">
                          {e.type === 'start' ? 'Başlangıç' : 'Son başvuru'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-stone-400 py-4 text-center">Yaklaşan tarih yok</p>
          )}
        </div>
      </div>
    </div>
  );
}
