import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import YearCalendarGrid from "@/components/calendar/YearCalendarGrid";
import { mockCalendarEvents } from "@/data/mockData";
import StatusBadge from "@/components/shared/StatusBadge";
import {
  Calendar as CalIcon,
  Clock,
  Users,
  Plus,
  Eye,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { CalendarEvent } from "@/types";
import { useLocation } from "react-router-dom";

type ViewMode = "year" | "list";

const STORAGE_KEY = "imem-program-calendar-events";
const LEGACY_STORAGE_KEY = "imem-coordinator-calendar-events";

const EMPTY_FORM = {
  title: "",
  description: "",
  date: "",
  time: "09:00",
  type: "meeting" as CalendarEvent["type"],
  participants: "",
};

function loadEvents(): CalendarEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as CalendarEvent[];
  } catch {
    /* use defaults */
  }
  return [...mockCalendarEvents];
}

function saveEvents(events: CalendarEvent[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function formatDisplayDate(dateKey: string) {
  return new Date(dateKey + "T12:00:00").toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatListDate(dateKey: string) {
  return new Date(dateKey + "T12:00:00").toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function CalendarPage() {
  const location = useLocation();
  const isDepartmentHead = location.pathname.startsWith("/department-head/calendar");
  const hasYearCalendar =
    location.pathname.startsWith("/internship-coordinator/calendar") || isDepartmentHead;
  const canManageEvents = hasYearCalendar;
  const currentYear = new Date().getFullYear();

  const [events, setEvents] = useState<CalendarEvent[]>(() => loadEvents());
  const [viewMode, setViewMode] = useState<ViewMode>(hasYearCalendar ? "year" : "list");
  const [calendarYear, setCalendarYear] = useState(currentYear);
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [dayDialogOpen, setDayDialogOpen] = useState(false);
  const [selected, setSelected] = useState<CalendarEvent | null>(null);
  const [dayEvents, setDayEvents] = useState<CalendarEvent[]>([]);
  const [selectedDateKey, setSelectedDateKey] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [form, setForm] = useState(EMPTY_FORM);

  const persistEvents = useCallback((next: CalendarEvent[]) => {
    setEvents(next);
    if (canManageEvents) saveEvents(next);
  }, [canManageEvents]);

  const filtered = useMemo(
    () =>
      events
        .filter((e) => typeFilter === "all" || e.type === typeFilter)
        .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)),
    [events, typeFilter],
  );

  const upcomingCount = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return events.filter((e) => e.date >= today).length;
  }, [events]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
  };

  const handleCreateEvent = () => {
    if (!form.title.trim() || !form.date) {
      toast.error("Please enter a title and date.");
      return;
    }

    const newEvent: CalendarEvent = {
      id: "ev-" + Date.now(),
      title: form.title.trim(),
      description: form.description.trim() || "No description provided.",
      date: form.date,
      time: form.time || "09:00",
      type: form.type,
      participants: form.participants
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
    };

    persistEvents([...events, newEvent]);
    setCalendarYear(Number(form.date.split("-")[0]));
    setCreateOpen(false);
    resetForm();
    toast.success("Event saved — visible on calendar and in upcoming list.");
  };

  const handleDayClick = (dateKey: string, dayItems: CalendarEvent[]) => {
    setSelectedDateKey(dateKey);
    setDayEvents(dayItems);
    setDayDialogOpen(true);
  };

  const createEventDialog = (
    <Dialog
      open={createOpen}
      onOpenChange={(open) => {
        setCreateOpen(open);
        if (!open) resetForm();
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              placeholder="Event title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Event description"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input
                type="time"
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v as CalendarEvent["type"] }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="defense">Defense</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="deadline">Deadline</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="site_visit">Site Visit</SelectItem>
                <SelectItem value="orientation">Orientation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Participants</Label>
            <Input
              placeholder="Comma-separated names"
              value={form.participants}
              onChange={(e) => setForm((f) => ({ ...f, participants: e.target.value }))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setCreateOpen(false)}>
            Cancel
          </Button>
          <Button className="gradient-primary" onClick={handleCreateEvent}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const eventDetailDialog = (
    <>
      <Dialog open={dayDialogOpen} onOpenChange={setDayDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Events on {selectedDateKey ? formatDisplayDate(selectedDateKey) : ""}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {dayEvents.map((event) => (
              <Card
                key={event.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  setSelected(event);
                  setViewOpen(true);
                }}
              >
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-sm">{event.title}</p>
                    <StatusBadge status={event.type} />
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{event.description}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {event.participants.length} participants
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <StatusBadge status={selected.type} />
              <p>{selected.description}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <CalIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDisplayDate(selected.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{selected.time}</span>
                </div>
              </div>
              {selected.participants.length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-2">Participants</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.participants.map((p) => (
                      <span key={p} className="px-2 py-1 rounded-full bg-muted text-xs font-medium">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );

  if (hasYearCalendar && viewMode === "year") {
    return (
      <div className="space-y-6 animate-in">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Calendar</h1>
            <p className="text-muted-foreground text-sm">
              Modern year view — {upcomingCount} upcoming events across all years
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-lg border bg-card shadow-sm">
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setCalendarYear((y) => y - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="px-3 text-lg font-bold tabular-nums min-w-[4.5rem] text-center">{calendarYear}</span>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setCalendarYear((y) => y + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={() => setCalendarYear(currentYear)}>
              Today
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" /> New Event
            </Button>
            <Button
              variant="link"
              className="gap-1.5 text-primary px-0 h-auto font-semibold"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
              Upcoming events and deadlines
            </Button>
          </div>
        </div>

        <YearCalendarGrid year={calendarYear} events={events} onDayClick={handleDayClick} />

        {createEventDialog}
        {eventDetailDialog}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-muted-foreground text-sm">Upcoming events and deadlines ({filtered.length})</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {canManageEvents && (
            <Button variant="outline" className="gap-2" onClick={() => setViewMode("year")}>
              <LayoutGrid className="h-4 w-4" /> Year calendar view
            </Button>
          )}
          {canManageEvents && (
            <Button className="gradient-primary gap-2" onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" /> New Event
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="defense">Defense</SelectItem>
            <SelectItem value="meeting">Meeting</SelectItem>
            <SelectItem value="deadline">Deadline</SelectItem>
            <SelectItem value="event">Event</SelectItem>
            <SelectItem value="site_visit">Site Visit</SelectItem>
            <SelectItem value="orientation">Orientation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((e) => (
          <Card
            key={e.id}
            className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer"
            onClick={() => {
              setSelected(e);
              setViewOpen(true);
            }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <StatusBadge status={e.type} />
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="text-base mt-2">{e.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">{e.description}</p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalIcon className="h-4 w-4" /> {formatListDate(e.date)}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" /> {e.time}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" /> {e.participants.length} participants
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {createEventDialog}
      {eventDetailDialog}
    </div>
  );
}
