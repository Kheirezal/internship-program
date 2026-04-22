import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/shared/StatusBadge";
import { mockOrientationSessions } from "@/data/mockData";
import { Plus, Calendar, Clock, MapPin, Users, Eye } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { OrientationSession } from "@/types";

const TOPIC_LABELS: Record<string, string> = {
  professional_ethics: "Professional Ethics",
  workplace_behavior: "Workplace Behavior",
  nda: "NDA & Confidentiality",
  industry_expectations: "Industry Expectations",
  general: "General",
};

const TOPIC_COLORS: Record<string, string> = {
  professional_ethics: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  workplace_behavior: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  nda: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  industry_expectations: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  general: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300",
};

export default function OrientationPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<OrientationSession | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = mockOrientationSessions.filter(s => statusFilter === "all" || s.status === statusFilter);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Orientation Sessions</h1>
          <p className="text-muted-foreground text-sm">Manage pre-internship orientation and training</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary gap-2"><Plus className="h-4 w-4" /> Schedule Session</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Schedule Orientation Session</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Title</Label><Input placeholder="Session title" /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Session details..." rows={3} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Topic</Label>
                  <Select defaultValue="professional_ethics">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional_ethics">Professional Ethics</SelectItem>
                      <SelectItem value="workplace_behavior">Workplace Behavior</SelectItem>
                      <SelectItem value="nda">NDA & Confidentiality</SelectItem>
                      <SelectItem value="industry_expectations">Industry Expectations</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Duration</Label><Input placeholder="e.g. 2 hours" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Date</Label><Input type="date" /></div>
                <div className="space-y-2"><Label>Time</Label><Input type="time" /></div>
              </div>
              <div className="space-y-2"><Label>Location</Label><Input placeholder="Room or virtual link" /></div>
              <div className="space-y-2"><Label>Presenter</Label><Input placeholder="Who will conduct the session" /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button className="gradient-primary" onClick={() => { setCreateOpen(false); toast.success("Session scheduled!"); }}>Schedule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="scheduled">Scheduled</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((session) => (
          <Card key={session.id} className="shadow-card border-none hover:shadow-elevated transition-all cursor-pointer" onClick={() => { setSelected(session); setViewOpen(true); }}>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{session.title}</h3>
                    <StatusBadge status={session.status} />
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${TOPIC_COLORS[session.topic]}`}>
                    {TOPIC_LABELS[session.topic]}
                  </span>
                </div>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{session.description}</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{session.date}</div>
                <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{session.time} ({session.duration})</div>
                <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{session.location}</div>
                <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{session.attendees.length} attendees</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{selected?.title}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded text-xs font-medium ${TOPIC_COLORS[selected.topic]}`}>{TOPIC_LABELS[selected.topic]}</span>
                <StatusBadge status={selected.status} />
              </div>
              <p className="leading-relaxed">{selected.description}</p>
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-muted/50">
                <div><p className="text-muted-foreground text-xs">Date & Time</p><p className="font-medium">{selected.date} at {selected.time}</p></div>
                <div><p className="text-muted-foreground text-xs">Duration</p><p className="font-medium">{selected.duration}</p></div>
                <div><p className="text-muted-foreground text-xs">Location</p><p className="font-medium">{selected.location}</p></div>
                <div><p className="text-muted-foreground text-xs">Presenter</p><p className="font-medium">{selected.presenter}</p></div>
              </div>
              <div>
                <p className="text-muted-foreground mb-2">Attendees ({selected.attendees.length})</p>
                <div className="flex flex-wrap gap-2">
                  {selected.attendees.map(a => (
                    <span key={a} className="px-2.5 py-1 rounded-full bg-muted text-xs font-medium">{a}</span>
                  ))}
                </div>
              </div>
              {selected.materials && selected.materials.length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-2">Materials</p>
                  {selected.materials.map(m => (
                    <span key={m} className="px-2.5 py-1 rounded bg-primary/10 text-primary text-xs font-medium">{m}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
