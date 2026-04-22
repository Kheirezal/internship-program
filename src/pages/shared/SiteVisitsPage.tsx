import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/shared/StatusBadge";
import { mockSiteVisits, mockPlacements } from "@/data/mockData";
import { Plus, MapPin, Calendar, Clock, Eye, Star, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { SiteVisit } from "@/types";
import { useAuthStore } from "@/stores/authStore";
import { Slider } from "@/components/ui/slider";

export default function SiteVisitsPage() {
  const { user } = useAuthStore();
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [selected, setSelected] = useState<SiteVisit | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const isCoordinator = user?.role === "internship_coordinator";

  const filtered = mockSiteVisits.filter(s => statusFilter === "all" || s.status === statusFilter);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Site Visits</h1>
          <p className="text-muted-foreground text-sm">
            {isCoordinator ? "Schedule and monitor advisor site visits" : "Manage your site visit schedule"}
          </p>
        </div>
        {isCoordinator && (
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary gap-2"><Plus className="h-4 w-4" /> Schedule Visit</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Schedule Site Visit</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Student / Placement</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select placement" /></SelectTrigger>
                    <SelectContent>
                      {mockPlacements.filter(p => p.status === "active").map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.studentName} — {p.companyName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Date</Label><Input type="date" /></div>
                  <div className="space-y-2"><Label>Time</Label><Input type="time" /></div>
                </div>
                <div className="space-y-2"><Label>Notes</Label><Textarea placeholder="Visit objectives..." rows={3} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button className="gradient-primary" onClick={() => { setCreateOpen(false); toast.success("Site visit scheduled!"); }}>
                  <Calendar className="h-4 w-4 mr-2" /> Schedule
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Visits</SelectItem>
          <SelectItem value="scheduled">Scheduled</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(visit => (
          <Card key={visit.id} className="shadow-card border-none hover:shadow-elevated transition-all">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{visit.studentName}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{visit.companyName}</p>
                </div>
                <StatusBadge status={visit.status} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{visit.scheduledDate}</div>
                <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{visit.scheduledTime}</div>
                <div>Advisor: <span className="font-medium text-foreground">{visit.advisorName}</span></div>
                <div>Supervisor: <span className="font-medium text-foreground">{visit.supervisorName}</span></div>
              </div>
              {visit.notes && <p className="text-xs text-muted-foreground bg-muted/50 rounded p-2">{visit.notes}</p>}
              {visit.status === "completed" && visit.workEnvironmentRating && (
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-amber-500" />Environment: {visit.workEnvironmentRating}/5</div>
                  <div className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-amber-500" />Task Relevance: {visit.taskRelevanceRating}/5</div>
                </div>
              )}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { setSelected(visit); setViewOpen(true); }}>
                  <Eye className="h-3 w-3 mr-1" /> Details
                </Button>
                {visit.status === "scheduled" && !isCoordinator && (
                  <Button size="sm" className="h-7 text-xs gradient-primary" onClick={() => { setSelected(visit); setCompleteOpen(true); }}>
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Complete Visit
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Site Visit Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground text-xs">Student</p><p className="font-medium">{selected.studentName}</p></div>
                <div><p className="text-muted-foreground text-xs">Company</p><p className="font-medium">{selected.companyName}</p></div>
                <div><p className="text-muted-foreground text-xs">Advisor</p><p className="font-medium">{selected.advisorName}</p></div>
                <div><p className="text-muted-foreground text-xs">Supervisor</p><p className="font-medium">{selected.supervisorName}</p></div>
                <div><p className="text-muted-foreground text-xs">Date & Time</p><p className="font-medium">{selected.scheduledDate} at {selected.scheduledTime}</p></div>
                <div><p className="text-muted-foreground text-xs">Status</p><StatusBadge status={selected.status} /></div>
              </div>
              {selected.notes && <div><p className="text-muted-foreground text-xs mb-1">Notes</p><p className="p-3 rounded-lg bg-muted/50">{selected.notes}</p></div>}
              {selected.findings && <div><p className="text-muted-foreground text-xs mb-1">Findings</p><p className="p-3 rounded-lg bg-muted/50">{selected.findings}</p></div>}
              {selected.workEnvironmentRating && (
                <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-muted/50">
                  <div><p className="text-muted-foreground text-xs">Work Environment</p><p className="font-bold">{selected.workEnvironmentRating}/5 ⭐</p></div>
                  <div><p className="text-muted-foreground text-xs">Task Relevance</p><p className="font-bold">{selected.taskRelevanceRating}/5 ⭐</p></div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Complete Visit Dialog */}
      <Dialog open={completeOpen} onOpenChange={setCompleteOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Complete Site Visit</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{selected?.studentName} at {selected?.companyName}</p>
            <div className="space-y-2"><Label>Findings</Label><Textarea placeholder="Describe your observations from the visit..." rows={4} /></div>
            <div className="space-y-2">
              <Label>Work Environment Rating</Label>
              <Slider defaultValue={[4]} max={5} min={1} step={1} />
              <p className="text-xs text-muted-foreground">1 = Poor, 5 = Excellent</p>
            </div>
            <div className="space-y-2">
              <Label>Task Relevance Rating</Label>
              <Slider defaultValue={[4]} max={5} min={1} step={1} />
              <p className="text-xs text-muted-foreground">1 = Not relevant, 5 = Highly relevant</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleteOpen(false)}>Cancel</Button>
            <Button className="gradient-primary" onClick={() => { setCompleteOpen(false); toast.success("Site visit completed!"); }}>Submit Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
