import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { mockCalendarEvents } from "@/data/mockData";
import StatusBadge from "@/components/shared/StatusBadge";
import { Calendar as CalIcon, Clock, Users, Plus, Eye } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { CalendarEvent } from "@/types";

export default function CalendarPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<CalendarEvent | null>(null);
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = mockCalendarEvents.filter(e => typeFilter === "all" || e.type === typeFilter);

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Calendar</h1><p className="text-muted-foreground text-sm">Upcoming events and deadlines</p></div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild><Button className="gradient-primary gap-2"><Plus className="h-4 w-4" /> New Event</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Event</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Title</Label><Input placeholder="Event title" /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Event description" rows={3} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Date</Label><Input type="date" /></div>
                <div className="space-y-2"><Label>Time</Label><Input type="time" /></div>
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select><SelectTrigger><SelectValue placeholder="Event type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="defense">Defense</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Participants</Label><Input placeholder="Comma-separated names" /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button className="gradient-primary" onClick={() => { setCreateOpen(false); toast.success("Event created!"); }}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-3">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="defense">Defense</SelectItem>
            <SelectItem value="meeting">Meeting</SelectItem>
            <SelectItem value="deadline">Deadline</SelectItem>
            <SelectItem value="event">Event</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((e) => (
          <Card key={e.id} className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer" onClick={() => { setSelected(e); setViewOpen(true); }}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <StatusBadge status={e.type} />
                <Button size="icon" variant="ghost" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
              </div>
              <CardTitle className="text-base mt-2">{e.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">{e.description}</p>
              <div className="flex items-center gap-2 text-muted-foreground"><CalIcon className="h-4 w-4" /> {e.date}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" /> {e.time}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Users className="h-4 w-4" /> {e.participants.length} participants</div>
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
              <StatusBadge status={selected.type} />
              <p>{selected.description}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2"><CalIcon className="h-4 w-4 text-muted-foreground" /><span>{selected.date}</span></div>
                <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /><span>{selected.time}</span></div>
              </div>
              <div>
                <p className="text-muted-foreground mb-2">Participants</p>
                <div className="flex flex-wrap gap-2">
                  {selected.participants.map(p => (
                    <span key={p} className="px-2 py-1 rounded-full bg-muted text-xs font-medium">{p}</span>
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
