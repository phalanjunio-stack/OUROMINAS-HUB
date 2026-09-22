"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type CalEvent = { id: string; title: string; date: Date; color: string | null; typeLabel: string };

const WEEKDAYS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];
const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function UpcomingCalendar({ events }: { events: CalEvent[] }) {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const days = useMemo(() => {
    const firstOfMonth = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const startWeekday = firstOfMonth.getDay();
    const gridStart = new Date(firstOfMonth);
    gridStart.setDate(gridStart.getDate() - startWeekday);
    return Array.from({ length: 42 }, (_, i) => {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + i);
      return date;
    });
  }, [cursor]);

  const eventsByDay = (date: Date) => events.filter((e) => sameDay(e.date, date));

  const upcoming = useMemo(
    () =>
      events
        .filter((e) => e.date.getTime() >= new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime())
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .slice(0, 5),
    [events, today],
  );

  return (
    <div className="grid gap-5 sm:grid-cols-[1fr_170px]">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-bold text-hub-ink">
            {MONTHS[cursor.getMonth()]} de {cursor.getFullYear()}
          </p>
          <div className="flex gap-1">
            <button
              type="button"
              aria-label="Mês anterior"
              onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-hub-line text-hub-ink/50 transition hover:border-hub-gold/50 hover:text-hub-brown"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              aria-label="Próximo mês"
              onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-hub-line text-hub-ink/50 transition hover:border-hub-gold/50 hover:text-hub-brown"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-y-1.5 text-center">
          {WEEKDAYS.map((w) => (
            <span key={w} className="text-[10px] font-bold text-hub-ink/35">
              {w}
            </span>
          ))}
          {days.map((date, i) => {
            const inMonth = date.getMonth() === cursor.getMonth();
            const isToday = sameDay(date, today);
            const dayEvents = eventsByDay(date);
            return (
              <div key={i} className="flex flex-col items-center gap-0.5 py-0.5">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
                    isToday
                      ? "bg-hub-brown font-bold text-white"
                      : dayEvents.length > 0
                        ? "bg-hub-gold/15 font-semibold text-hub-brown"
                        : inMonth
                          ? "text-hub-ink/70"
                          : "text-hub-ink/25"
                  }`}
                >
                  {date.getDate()}
                </span>
                <span className="flex h-1 gap-0.5">
                  {dayEvents.slice(0, 3).map((e) => (
                    <span key={e.id} className="h-1 w-1 rounded-full" style={{ background: e.color ?? "var(--hub-gold)" }} />
                  ))}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <ul className="flex flex-col gap-3 border-l border-hub-line pl-4">
        {upcoming.length === 0 && <li className="text-[12px] text-hub-ink/45">Sem eventos próximos.</li>}
        {upcoming.map((e) => (
          <li key={e.id} className="flex gap-2.5">
            <div className="flex h-9 w-9 flex-none flex-col items-center justify-center rounded-lg border border-hub-line bg-hub-paper text-center leading-none">
              <span className="text-[9px] font-bold uppercase text-hub-ink/45">{MONTHS[e.date.getMonth()].slice(0, 3)}</span>
              <span className="text-[13px] font-bold text-hub-ink">{e.date.getDate()}</span>
            </div>
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 truncate text-[12.5px] font-semibold text-hub-ink">
                <span className="h-1.5 w-1.5 flex-none rounded-full" style={{ background: e.color ?? "var(--hub-gold)" }} />
                {e.title}
              </p>
              <p className="truncate text-[11px] text-hub-ink/45">{e.typeLabel}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
