import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StatusBadge from "@/components/shared/StatusBadge";
import StatsCard from "@/components/shared/StatsCard";
import { mockPlacements } from "@/data/mockData";
import type {
  AdvisorFollowUp,
  AdvisorFollowUpOutcome,
  AdvisorFollowUpType,
  Placement,
} from "@/types";
import {
  CalendarClock,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Video,
  MapPin,
  Phone,
  Users,
  List,
  LayoutList,
  MessageSquare,
  ClipboardCheck,
  XCircle,
  Eye,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const TYPE_LABELS: Record<AdvisorFollowUpType, string> = {
  weekly: "Weekly Check-in",
  mid_term: "Mid-term Review",
  milestone: "Milestone Meeting",
  ad_hoc: "Ad-hoc Session",
};

const OUTCOME_LABELS: Record<AdvisorFollowUpOutcome, string> = {
  on_track: "On track",
  needs_attention: "Needs attention",
  at_risk: "At risk",
};

const EMPTY_SCHEDULE = {
  placementId: "",
  type: "weekly" as AdvisorFollowUpType,
  scheduledDate: "",
  scheduledTime: "10:00",
  meetingMode: "virtual" as "in_person" | "virtual" | "phone",
  location: "",
  discussionPoints: "",
  actionItems: "",
};

const EMPTY_COMPLETE = {
  meetingNotes: "",
  actionItems: "",
  outcomeSummary: "on_track" as AdvisorFollowUpOutcome,
  nextFollowUpDate: "",
};

function parseDate(date: string) {
  return new Date(date + "T12:00:00");
}

function formatDisplayDate(date: string) {
  return parseDate(date).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isOverdue(fu: AdvisorFollowUp) {
  if (fu.status !== "scheduled") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parseDate(fu.scheduledDate) < today;
}

function isThisWeek(date: string) {
  const d = parseDate(date);
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return d >= start && d < end;
}

function MeetingModeIcon({ mode }: { mode?: AdvisorFollowUp["meetingMode"] }) {
  if (mode === "in_person") return <MapPin className="h-3.5 w-3.5" />;
  if (mode === "phone") return <Phone className="h-3.5 w-3.5" />;
  return <Video className="h-3.5 w-3.5" />;
}

interface AdvisorFollowUpTabProps {
  followUps: AdvisorFollowUp[];
  onFollowUpsChange: React.Dispatch<React.SetStateAction<AdvisorFollowUp[]>>;
  myPlacements: Placement[];
}

export default function AdvisorFollowUpTab({
  followUps,
  onFollowUpsChange,
  myPlacements,
}: AdvisorFollowUpTabProps) {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"timeline" | "students">("timeline");

  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<AdvisorFollowUp | null>(null);
  const [scheduleForm, setScheduleForm] = useState(EMPTY_SCHEDULE);
  const [completeForm, setCompleteForm] = useState(EMPTY_COMPLETE);

  const stats = useMemo(() => {
    const scheduled = followUps.filter((f) => f.status === "scheduled").length;
    const completed = followUps.filter((f) => f.status === "completed").length;
    const missed = followUps.filter((f) => f.status === "missed").length;
    const overdue = followUps.filter(isOverdue).length;
    const thisWeek = followUps.filter(
      (f) => f.status === "scheduled" && isThisWeek(f.scheduledDate)
    ).length;
    return { scheduled, completed, missed, overdue, thisWeek };
  }, [followUps]);

  const filtered = useMemo(() => {
    return followUps
      .filter((f) => statusFilter === "all" || f.status === statusFilter)
      .filter((f) => typeFilter === "all" || f.type === typeFilter)
      .filter((f) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          f.studentName.toLowerCase().includes(q) ||
          f.discussionPoints.toLowerCase().includes(q) ||
          TYPE_LABELS[f.type].toLowerCase().includes(q)
        );
      })
      .sort((a, b) => parseDate(b.scheduledDate).getTime() - parseDate(a.scheduledDate).getTime());
  }, [followUps, statusFilter, typeFilter, search]);

  const grouped = useMemo(() => {
    const upcoming = filtered.filter((f) => f.status === "scheduled" && !isOverdue(f));
    const overdue = filtered.filter(isOverdue);
    const completed = filtered.filter((f) => f.status === "completed");
    const missed = filtered.filter((f) => f.status === "missed");
    return { upcoming, overdue, completed, missed };
  }, [filtered]);

  const studentCadence = useMemo(() => {
    return myPlacements
      .filter((p) => p.status === "active")
      .map((p) => {
        const studentFollowUps = followUps
          .filter((f) => f.placementId === p.id)
          .sort((a, b) => parseDate(b.scheduledDate).getTime() - parseDate(a.scheduledDate).getTime());
        const lastCompleted = studentFollowUps.find((f) => f.status === "completed");
        const nextScheduled = studentFollowUps.find(
          (f) => f.status === "scheduled" && !isOverdue(f)
        );
        const overdue = studentFollowUps.some(isOverdue);
        return {
          placement: p,
          lastCompleted,
          nextScheduled,
          overdue,
          total: studentFollowUps.length,
        };
      });
  }, [myPlacements, followUps]);

  const openComplete = (fu: AdvisorFollowUp) => {
    setSelected(fu);
    setCompleteForm({
      meetingNotes: fu.meetingNotes ?? "",
      actionItems: fu.actionItems,
      outcomeSummary: fu.outcomeSummary ?? "on_track",
      nextFollowUpDate: fu.nextFollowUpDate ?? "",
    });
    setCompleteOpen(true);
  };

  const handleSchedule = () => {
    const placement = myPlacements.find((p) => p.id === scheduleForm.placementId);
    if (!placement || !scheduleForm.scheduledDate || !scheduleForm.discussionPoints.trim()) {
      toast.error("Select a student, date, and discussion points.");
      return;
    }

    const newFollowUp: AdvisorFollowUp = {
      id: "afu-" + Date.now(),
      placementId: placement.id,
      studentName: placement.studentName,
      type: scheduleForm.type,
      scheduledDate: scheduleForm.scheduledDate,
      scheduledTime: scheduleForm.scheduledTime,
      meetingMode: scheduleForm.meetingMode,
      location: scheduleForm.location || undefined,
      status: "scheduled",
      discussionPoints: scheduleForm.discussionPoints.trim(),
      actionItems: scheduleForm.actionItems.trim() || "TBD after meeting",
      nextFollowUpDate: undefined,
    };

    onFollowUpsChange((prev) => [newFollowUp, ...prev]);
    setScheduleOpen(false);
    setScheduleForm(EMPTY_SCHEDULE);
    toast.success(`Follow-up scheduled with ${placement.studentName}`);
  };

  const handleComplete = () => {
    if (!selected) return;
    const today = new Date().toISOString().split("T")[0];

    onFollowUpsChange((prev) =>
      prev.map((f) =>
        f.id === selected.id
          ? {
              ...f,
              status: "completed" as const,
              completedDate: today,
              meetingNotes: completeForm.meetingNotes.trim(),
              actionItems: completeForm.actionItems.trim() || f.actionItems,
              outcomeSummary: completeForm.outcomeSummary,
              nextFollowUpDate: completeForm.nextFollowUpDate || f.nextFollowUpDate,
            }
          : f
      )
    );
    setCompleteOpen(false);
    setSelected(null);
    toast.success("Follow-up marked as completed");
  };

  const markMissed = (fu: AdvisorFollowUp) => {
    onFollowUpsChange((prev) =>
      prev.map((f) => (f.id === fu.id ? { ...f, status: "missed" as const } : f))
    );
    toast.warning(`Marked ${fu.studentName}'s session as missed`);
  };

  const FollowUpCard = ({ fu, showActions = true }: { fu: AdvisorFollowUp; showActions?: boolean }) => {
    const overdue = isOverdue(fu);
    return (
      <Card
        className={`shadow-card transition-all ${
          overdue ? "border-destructive/40 bg-destructive/5" : ""
        }`}
      >
        <CardContent className="p-5 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
                {fu.studentName.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold">{fu.studentName}</h3>
                <p className="text-xs text-muted-foreground">{TYPE_LABELS[fu.type]}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {overdue && (
                <span className="text-[10px] font-bold uppercase tracking-wide text-destructive px-2 py-0.5 rounded bg-destructive/10">
                  Overdue
                </span>
              )}
              <StatusBadge status={fu.status} />
              {fu.outcomeSummary && fu.status === "completed" && (
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    fu.outcomeSummary === "on_track"
                      ? "bg-emerald-500/10 text-emerald-700"
                      : fu.outcomeSummary === "needs_attention"
                        ? "bg-amber-500/10 text-amber-700"
                        : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {OUTCOME_LABELS[fu.outcomeSummary]}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <CalendarClock className="h-4 w-4 shrink-0" />
              <span className="font-medium text-foreground">{formatDisplayDate(fu.scheduledDate)}</span>
              {fu.scheduledTime && <span>· {fu.scheduledTime}</span>}
            </div>
            {fu.meetingMode && (
              <div className="flex items-center gap-1.5 text-muted-foreground capitalize">
                <MeetingModeIcon mode={fu.meetingMode} />
                {fu.meetingMode.replace("_", " ")}
                {fu.location && <span className="text-foreground">— {fu.location}</span>}
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-lg bg-muted/40 border">
              <p className="text-xs font-medium text-muted-foreground mb-1">Discussion points</p>
              <p className="leading-snug">{fu.discussionPoints}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/40 border">
              <p className="text-xs font-medium text-muted-foreground mb-1">Action items</p>
              <p className="leading-snug">{fu.actionItems}</p>
            </div>
          </div>

          {fu.meetingNotes && (
            <p className="text-xs p-2 rounded bg-primary/5 border border-primary/10 italic">
              Notes: {fu.meetingNotes}
            </p>
          )}

          {fu.nextFollowUpDate && (
            <p className="text-xs text-primary font-medium">
              Next follow-up: {formatDisplayDate(fu.nextFollowUpDate)}
            </p>
          )}

          {showActions && (
            <div className="flex flex-wrap gap-2 pt-1">
              {fu.status === "scheduled" && (
                <>
                  <Button size="sm" className="gradient-primary gap-1 h-8" onClick={() => openComplete(fu)}>
                    <ClipboardCheck className="h-3.5 w-3.5" /> Complete Session
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8"
                    onClick={() => navigate("/internship-advisor/oversight/calendar")}
                  >
                    <CalendarClock className="h-3.5 w-3.5 mr-1" /> Calendar
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 text-destructive" onClick={() => markMissed(fu)}>
                    <XCircle className="h-3.5 w-3.5 mr-1" /> Missed
                  </Button>
                </>
              )}
              {(fu.status === "completed" || fu.status === "missed") && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8"
                  onClick={() => {
                    setSelected(fu);
                    setDetailOpen(true);
                  }}
                >
                  <Eye className="h-3.5 w-3.5 mr-1" /> View Details
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="h-8"
                onClick={() => navigate("/internship-advisor/oversight/messages")}
              >
                <MessageSquare className="h-3.5 w-3.5 mr-1" /> Message
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const Section = ({
    title,
    items,
    icon: Icon,
  }: {
    title: string;
    items: AdvisorFollowUp[];
    icon: React.ElementType;
  }) => {
    if (items.length === 0) return null;
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
          <Icon className="h-4 w-4" />
          {title}
          <span className="text-xs font-normal">({items.length})</span>
        </h3>
        {items.map((fu) => (
          <FollowUpCard key={fu.id} fu={fu} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Periodic Follow-ups</h2>
          <p className="text-sm text-muted-foreground">
            Plan check-ins, record meeting outcomes, and track action items per advisee.
          </p>
        </div>
        <Button className="gradient-primary gap-2 shrink-0" onClick={() => setScheduleOpen(true)}>
          <Plus className="h-4 w-4" /> Schedule Follow-up
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatsCard title="Scheduled" value={stats.scheduled} icon={CalendarClock} description="upcoming sessions" />
        <StatsCard title="This Week" value={stats.thisWeek} icon={Clock} description="due in 7 days" />
        <StatsCard
          title="Overdue"
          value={stats.overdue}
          icon={AlertTriangle}
          trend={stats.overdue > 0 ? { value: stats.overdue, positive: false } : undefined}
          description="need action"
        />
        <StatsCard title="Completed" value={stats.completed} icon={CheckCircle2} description="logged sessions" />
        <StatsCard title="Missed" value={stats.missed} icon={XCircle} description="no-shows" />
      </div>

      <Card className="shadow-card">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search student or topic..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="missed">Missed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="mid_term">Mid-term</SelectItem>
                <SelectItem value="milestone">Milestone</SelectItem>
                <SelectItem value="ad_hoc">Ad-hoc</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex rounded-lg border p-1 bg-muted/30 shrink-0">
              <Button
                type="button"
                size="sm"
                variant={viewMode === "timeline" ? "secondary" : "ghost"}
                className="h-8 gap-1"
                onClick={() => setViewMode("timeline")}
              >
                <LayoutList className="h-3.5 w-3.5" /> Timeline
              </Button>
              <Button
                type="button"
                size="sm"
                variant={viewMode === "students" ? "secondary" : "ghost"}
                className="h-8 gap-1"
                onClick={() => setViewMode("students")}
              >
                <Users className="h-3.5 w-3.5" /> By Student
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {viewMode === "students" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {studentCadence.map(({ placement, lastCompleted, nextScheduled, overdue, total }) => (
            <Card key={placement.id} className={`shadow-card ${overdue ? "border-destructive/30" : ""}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{placement.studentName}</CardTitle>
                <CardDescription>{placement.companyName} · {placement.progress}% complete</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-muted/50">
                    <p className="text-muted-foreground">Sessions</p>
                    <p className="font-bold text-lg">{total}</p>
                  </div>
                  <div className="p-2 rounded bg-muted/50">
                    <p className="text-muted-foreground">Cadence</p>
                    <p className="font-medium">Weekly + milestones</p>
                  </div>
                </div>
                {lastCompleted && (
                  <div>
                    <p className="text-xs text-muted-foreground">Last completed</p>
                    <p className="font-medium">{formatDisplayDate(lastCompleted.completedDate!)}</p>
                    <p className="text-xs text-muted-foreground truncate">{TYPE_LABELS[lastCompleted.type]}</p>
                  </div>
                )}
                {nextScheduled ? (
                  <div className={overdue ? "text-destructive" : "text-primary"}>
                    <p className="text-xs text-muted-foreground">Next session</p>
                    <p className="font-medium">
                      {formatDisplayDate(nextScheduled.scheduledDate)}
                      {nextScheduled.scheduledTime && ` · ${nextScheduled.scheduledTime}`}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-amber-600 font-medium">No upcoming session scheduled</p>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-8"
                    onClick={() => {
                      setScheduleForm({ ...EMPTY_SCHEDULE, placementId: placement.id });
                      setScheduleOpen(true);
                    }}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" /> Schedule
                  </Button>
                  {nextScheduled && (
                    <Button
                      size="sm"
                      className="flex-1 h-8 gradient-primary"
                      onClick={() => openComplete(nextScheduled)}
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="py-12 text-center">
            <List className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="font-medium">No follow-ups match your filters</p>
            <Button className="mt-4 gradient-primary gap-2" onClick={() => setScheduleOpen(true)}>
              <Plus className="h-4 w-4" /> Schedule first follow-up
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          <Section title="Overdue — action required" items={grouped.overdue} icon={AlertTriangle} />
          <Section title="Upcoming" items={grouped.upcoming} icon={CalendarClock} />
          <Section title="Completed" items={grouped.completed} icon={CheckCircle2} />
          <Section title="Missed sessions" items={grouped.missed} icon={XCircle} />
        </div>
      )}

      {/* Schedule dialog */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule Follow-up</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Student</Label>
              <Select
                value={scheduleForm.placementId}
                onValueChange={(v) => setScheduleForm((f) => ({ ...f, placementId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select advisee" />
                </SelectTrigger>
                <SelectContent>
                  {myPlacements
                    .filter((p) => p.status === "active" || p.status === "pending_student_confirmation")
                    .map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.studentName} — {p.companyName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Session type</Label>
              <Select
                value={scheduleForm.type}
                onValueChange={(v) =>
                  setScheduleForm((f) => ({ ...f, type: v as AdvisorFollowUpType }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(TYPE_LABELS) as AdvisorFollowUpType[]).map((t) => (
                    <SelectItem key={t} value={t}>
                      {TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={scheduleForm.scheduledDate}
                  onChange={(e) => setScheduleForm((f) => ({ ...f, scheduledDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Input
                  type="time"
                  value={scheduleForm.scheduledTime}
                  onChange={(e) => setScheduleForm((f) => ({ ...f, scheduledTime: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Meeting mode</Label>
                <Select
                  value={scheduleForm.meetingMode}
                  onValueChange={(v) =>
                    setScheduleForm((f) => ({
                      ...f,
                      meetingMode: v as "in_person" | "virtual" | "phone",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="virtual">Virtual</SelectItem>
                    <SelectItem value="in_person">In person</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Location / link</Label>
                <Input
                  placeholder="Room 204 or Teams link"
                  value={scheduleForm.location}
                  onChange={(e) => setScheduleForm((f) => ({ ...f, location: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Discussion points</Label>
              <Textarea
                rows={3}
                placeholder="Agenda for this check-in..."
                value={scheduleForm.discussionPoints}
                onChange={(e) => setScheduleForm((f) => ({ ...f, discussionPoints: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Pre-meeting action items (optional)</Label>
              <Textarea
                rows={2}
                placeholder="What should the student prepare?"
                value={scheduleForm.actionItems}
                onChange={(e) => setScheduleForm((f) => ({ ...f, actionItems: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleOpen(false)}>
              Cancel
            </Button>
            <Button className="gradient-primary" onClick={handleSchedule}>
              Schedule Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete session dialog */}
      <Dialog open={completeOpen} onOpenChange={setCompleteOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete Follow-up — {selected?.studentName}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/50 text-sm">
                <p className="font-medium">{TYPE_LABELS[selected.type]}</p>
                <p className="text-muted-foreground text-xs mt-1">{selected.discussionPoints}</p>
              </div>
              <div className="space-y-2">
                <Label>Meeting notes</Label>
                <Textarea
                  rows={4}
                  placeholder="Summary of discussion, feedback given..."
                  value={completeForm.meetingNotes}
                  onChange={(e) => setCompleteForm((f) => ({ ...f, meetingNotes: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Action items for student</Label>
                <Textarea
                  rows={2}
                  value={completeForm.actionItems}
                  onChange={(e) => setCompleteForm((f) => ({ ...f, actionItems: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Student status</Label>
                  <Select
                    value={completeForm.outcomeSummary}
                    onValueChange={(v) =>
                      setCompleteForm((f) => ({
                        ...f,
                        outcomeSummary: v as AdvisorFollowUpOutcome,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(OUTCOME_LABELS) as AdvisorFollowUpOutcome[]).map((o) => (
                        <SelectItem key={o} value={o}>
                          {OUTCOME_LABELS[o]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Next follow-up date</Label>
                  <Input
                    type="date"
                    value={completeForm.nextFollowUpDate}
                    onChange={(e) =>
                      setCompleteForm((f) => ({ ...f, nextFollowUpDate: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleteOpen(false)}>
              Cancel
            </Button>
            <Button className="gradient-primary" onClick={handleComplete}>
              Save & Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Session Record — {selected?.studentName}</DialogTitle>
          </DialogHeader>
          {selected && <FollowUpCard fu={selected} showActions={false} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
