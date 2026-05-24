import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEKDAYS = ["Su", "M", "Tu", "W", "Th", "F", "Sa"];

function toDateKey(year: number, monthIndex: number, day: number) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function buildEventsByDate(events: CalendarEvent[], year: number) {
  const map = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const [y] = event.date.split("-").map(Number);
    if (y !== year) continue;
    const list = map.get(event.date) ?? [];
    list.push(event);
    map.set(event.date, list);
  }
  return map;
}

interface YearCalendarGridProps {
  year: number;
  events: CalendarEvent[];
  onDayClick: (dateKey: string, dayEvents: CalendarEvent[]) => void;
}

function MiniMonth({
  year,
  monthIndex,
  eventsByDate,
  onDayClick,
  todayKey,
}: {
  year: number;
  monthIndex: number;
  eventsByDate: Map<string, CalendarEvent[]>;
  onDayClick: (dateKey: string, dayEvents: CalendarEvent[]) => void;
  todayKey: string;
}) {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const startDay = new Date(year, monthIndex, 1).getDay();
  const isCurrentMonth = new Date().getFullYear() === year && new Date().getMonth() === monthIndex;

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div
      className={cn(
        "rounded-xl border bg-card overflow-hidden transition-shadow hover:shadow-md",
        isCurrentMonth && "ring-2 ring-primary/30 shadow-sm",
      )}
    >
      <div className="px-3 py-2 border-b bg-primary/5 flex items-center justify-between">
        <span className="font-semibold text-sm">{MONTH_NAMES[monthIndex]}</span>
        {isCurrentMonth && (
          <span className="text-[10px] font-medium text-primary uppercase tracking-wide">This month</span>
        )}
      </div>
      <div className="grid grid-cols-7 px-1 pt-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5 p-1.5">
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={idx} className="h-8" />;
          }
          const dateKey = toDateKey(year, monthIndex, day);
          const dayEvents = eventsByDate.get(dateKey);
          const hasEvents = !!dayEvents?.length;
          const isDeadline = dayEvents?.some((e) => e.type === "deadline");
          const isToday = dateKey === todayKey;

          return (
            <button
              key={idx}
              type="button"
              disabled={!hasEvents}
              onClick={() => hasEvents && onDayClick(dateKey, dayEvents!)}
              className={cn(
                "relative h-8 rounded-lg text-xs font-medium flex flex-col items-center justify-center transition-all",
                isToday && "ring-2 ring-primary ring-offset-1",
                hasEvents
                  ? cn(
                      "cursor-pointer hover:scale-105",
                      isDeadline
                        ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                        : "bg-primary/15 text-primary",
                    )
                  : "text-muted-foreground hover:bg-muted/60",
              )}
              title={hasEvents ? `${dayEvents!.length} event(s)` : undefined}
            >
              <span className={cn(hasEvents && "font-bold")}>{day}</span>
              {hasEvents && (
                <span
                  className={cn(
                    "absolute bottom-0.5 h-1 w-1 rounded-full",
                    isDeadline ? "bg-amber-500" : "bg-primary",
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function YearCalendarGrid({ year, events, onDayClick }: YearCalendarGridProps) {
  const today = new Date();
  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());
  const eventsByDate = buildEventsByDate(events, year);
  const markedDays = eventsByDate.size;

  return (
    <div className="rounded-2xl border bg-card shadow-card overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b bg-muted/30">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{markedDays}</span> days with events in {year}
        </p>
      </div>
      <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-gradient-to-b from-muted/20 to-background">
        {MONTH_NAMES.map((_, monthIndex) => (
          <MiniMonth
            key={monthIndex}
            year={year}
            monthIndex={monthIndex}
            eventsByDate={eventsByDate}
            onDayClick={onDayClick}
            todayKey={todayKey}
          />
        ))}
      </div>
      <div className="px-4 py-3 border-t bg-muted/20 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-primary" /> Event
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Deadline
        </span>
        <span className="flex items-center gap-2">
          <span className="h-7 w-7 rounded-lg ring-2 ring-primary ring-offset-1 flex items-center justify-center text-[10px] font-bold text-primary">
            •
          </span>
          Today
        </span>
      </div>
    </div>
  );
}
