import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockDefenseSchedules, mockPlacements } from "@/data/mockData";
import StatusBadge from "@/components/shared/StatusBadge";
import { Target, Calendar, Clock, Users, Plus, MapPin, Timer, Briefcase, GraduationCap } from "lucide-react";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { DefenseSchedule } from "@/types";
import { useAuthStore } from "@/stores/authStore";

const EMPTY_FORM = {
  placementId: "",
  title: "",
  date: "",
  time: "",
  location: "",
  duration: "60 minutes",
  panelMembers: "",
};

function formatDate(date: string) {
  return new Date(date + "T12:00:00").toLocaleDateString(undefined, {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function DefenseDetail({ defense }: { defense: DefenseSchedule }) {
  return (
    <div className="space-y-4 text-sm">
      <div className="p-3 rounded-lg bg-muted/40 space-y-1">
        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wide">Student / Placement</p>
        <p className="font-semibold flex items-center gap-1.5">
          <GraduationCap className="h-4 w-4 text-primary" />
          {defense.studentName}
        </p>
        <p className="text-muted-foreground flex items-center gap-1.5">
          <Briefcase className="h-3.5 w-3.5" />
          {defense.companyName}
        </p>
      </div>
      {defense.description && <p className="text-muted-foreground">{defense.description}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
          <span>{formatDate(defense.date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
          <span>{defense.time}</span>
        </div>
        <div className="flex items-center gap-2 sm:col-span-2">
          <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
          <span>{defense.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Timer className="h-4 w-4 text-muted-foreground shrink-0" />
          <span>{defense.duration}</span>
        </div>
      </div>
      <div>
        <p className="text-muted-foreground mb-2 flex items-center gap-1">
          <Users className="h-4 w-4" /> Panel Members
        </p>
        <div className="flex flex-wrap gap-2">
          {defense.panelMembers.map((member) => (
            <span key={member} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              {member}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DefensePage() {
  const { user } = useAuthStore();
  const [defenses, setDefenses] = useState<DefenseSchedule[]>(() => [...mockDefenseSchedules]);
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<DefenseSchedule | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const isStudent = user?.role === "internship_student";
  const canSchedule = user?.role === "internship_coordinator";

  const activePlacements = mockPlacements.filter((p) => p.status === "active");

  const visibleDefenses = useMemo(() => {
    if (isStudent && user?.id) {
      return defenses.filter((d) => d.studentId === user.id);
    }
    return defenses;
  }, [defenses, isStudent, user?.id]);

  const resetForm = () => setForm(EMPTY_FORM);

  const handleSchedule = () => {
    const placement = activePlacements.find((p) => p.id === form.placementId);
    if (!placement || !form.title.trim() || !form.date || !form.time || !form.location.trim() || !form.panelMembers.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const panelMembers = form.panelMembers
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (panelMembers.length === 0) {
      toast.error("Add at least one panel member.");
      return;
    }

    const newDefense: DefenseSchedule = {
      id: "def-" + Date.now(),
      placementId: placement.id,
      studentId: placement.studentId,
      studentName: placement.studentName,
      companyName: placement.companyName,
      title: form.title.trim(),
      date: form.date,
      time: form.time,
      location: form.location.trim(),
      duration: form.duration.trim() || "60 minutes",
      panelMembers,
    };

    setDefenses((prev) => [...prev, newDefense]);
    setCreateOpen(false);
    resetForm();
    toast.success("Defense scheduled successfully.");
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Defense Schedule</h1>
          <p className="text-muted-foreground text-sm">
            {isStudent
              ? "View your scheduled defense arranged by the internship coordinator"
              : canSchedule
                ? "Schedule and manage internship defense presentations"
                : "View internship defense presentations"}
          </p>
        </div>
        {canSchedule && (
          <Dialog
            open={createOpen}
            onOpenChange={(open) => {
              setCreateOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button className="gradient-primary gap-2">
                <Plus className="h-4 w-4" /> Schedule Defense
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Schedule Defense</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Student / Placement</Label>
                  <Select
                    value={form.placementId}
                    onValueChange={(value) => setForm((f) => ({ ...f, placementId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select student placement" />
                    </SelectTrigger>
                    <SelectContent>
                      {activePlacements.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.studentName} — {p.companyName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    placeholder="Defense presentation title"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
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
                  <Label>Location / Room</Label>
                  <Input
                    placeholder="Room 301, Building A"
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Select
                    value={form.duration}
                    onValueChange={(value) => setForm((f) => ({ ...f, duration: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30 minutes">30 minutes</SelectItem>
                      <SelectItem value="45 minutes">45 minutes</SelectItem>
                      <SelectItem value="60 minutes">60 minutes</SelectItem>
                      <SelectItem value="90 minutes">90 minutes</SelectItem>
                      <SelectItem value="120 minutes">120 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Panel Members</Label>
                  <Textarea
                    placeholder="One name per line, e.g.&#10;Prof. James Wilson&#10;Dr. Maria Garcia"
                    rows={4}
                    value={form.panelMembers}
                    onChange={(e) => setForm((f) => ({ ...f, panelMembers: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button className="gradient-primary" onClick={handleSchedule}>
                  Schedule
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {visibleDefenses.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="py-12 text-center">
            <Target className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="font-medium">No defense scheduled yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              {isStudent
                ? "Your coordinator will schedule your defense and it will appear here."
                : "Schedule a defense using the button above."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleDefenses.map((d) => (
            <Card
              key={d.id}
              className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer"
              onClick={() => {
                setSelected(d);
                setViewOpen(true);
              }}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <StatusBadge status="defense" />
                  {!isStudent && (
                    <span className="text-xs text-muted-foreground truncate">{d.studentName}</span>
                  )}
                </div>
                <CardTitle className="text-base leading-snug">{d.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {isStudent && (
                  <p className="text-muted-foreground flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5" />
                    {d.companyName}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  {formatDate(d.date)}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                  {d.time} · {d.duration}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  {d.location}
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 flex items-center gap-1 text-xs">
                    <Users className="h-3.5 w-3.5" /> Panel
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {d.panelMembers.slice(0, 3).map((p) => (
                      <span key={p} className="px-2 py-0.5 rounded-full bg-muted text-xs">
                        {p}
                      </span>
                    ))}
                    {d.panelMembers.length > 3 && (
                      <span className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">
                        +{d.panelMembers.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
          </DialogHeader>
          {selected && <DefenseDetail defense={selected} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
