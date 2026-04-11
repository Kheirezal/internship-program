import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockCalendarEvents, mockPlacements } from "@/data/mockData";
import StatusBadge from "@/components/shared/StatusBadge";
import { Target, Calendar, Clock, Users, Plus, Eye, Edit } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { CalendarEvent } from "@/types";

export default function DefensePage() {
  const defenses = mockCalendarEvents.filter(e => e.type === "defense");
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<CalendarEvent | null>(null);

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Defense Schedule</h1><p className="text-muted-foreground text-sm">Manage internship defense presentations</p></div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild><Button className="gradient-primary gap-2"><Plus className="h-4 w-4" /> Schedule Defense</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Schedule Defense</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Student / Placement</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                  <SelectContent>{mockPlacements.filter(p => p.status === "active").map(p => <SelectItem key={p.id} value={p.id}>{p.studentName}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Title</Label><Input placeholder="Defense presentation title" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Date</Label><Input type="date" /></div>
                <div className="space-y-2"><Label>Time</Label><Input type="time" /></div>
              </div>
              <div className="space-y-2"><Label>Location / Room</Label><Input placeholder="Room 301, Building A" /></div>
              <div className="space-y-2"><Label>Panel Members</Label><Textarea placeholder="Names of panel members, one per line" rows={3} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button className="gradient-primary" onClick={() => { setCreateOpen(false); toast.success("Defense scheduled!"); }}>Schedule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {defenses.map((d) => (
          <Card key={d.id} className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer" onClick={() => { setSelected(d); setViewOpen(true); }}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <StatusBadge status="defense" />
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                </div>
              </div>
              <CardTitle className="text-base">{d.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">{d.description}</p>
              <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /> {d.date}</div>
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /> {d.time}</div>
              <div>
                <p className="text-muted-foreground mb-1 flex items-center gap-1"><Users className="h-4 w-4" /> Panel Members:</p>
                <div className="flex flex-wrap gap-1">
                  {d.participants.map(p => (
                    <span key={p} className="px-2 py-0.5 rounded-full bg-muted text-xs">{p}</span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{selected?.title}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <p>{selected.description}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /><span>{selected.date}</span></div>
                <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /><span>{selected.time}</span></div>
              </div>
              <div>
                <p className="text-muted-foreground mb-2">Panel Members</p>
                <div className="flex flex-wrap gap-2">
                  {selected.participants.map(p => (
                    <span key={p} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{p}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
