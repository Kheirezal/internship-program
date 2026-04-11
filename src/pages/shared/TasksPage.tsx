import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/shared/StatusBadge";
import { mockTasks, mockPlacements } from "@/data/mockData";
import { Plus, Eye, Edit, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Task } from "@/types";
import { useAuthStore } from "@/stores/authStore";

export default function TasksPage() {
  const { user } = useAuthStore();
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const isSupervisor = user?.role === "company_supervisor";
  const filtered = mockTasks
    .filter(t => statusFilter === "all" || t.status === statusFilter)
    .filter(t => priorityFilter === "all" || t.priority === priorityFilter);

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Tasks</h1><p className="text-muted-foreground text-sm">Manage assigned tasks</p></div>
        {isSupervisor && (
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild><Button className="gradient-primary gap-2"><Plus className="h-4 w-4" /> New Task</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Task</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2"><Label>Title</Label><Input placeholder="Task title" /></div>
                <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Task description" rows={3} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Assign To</Label>
                    <Select><SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                      <SelectContent>{mockPlacements.map(p => <SelectItem key={p.studentId} value={p.studentId}>{p.studentName}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Due Date</Label><Input type="date" /></div>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button className="gradient-primary" onClick={() => { setCreateOpen(false); toast.success("Task created!"); }}>Create Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map((t) => (
          <Card key={t.id} className="shadow-card hover:shadow-elevated transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{t.title}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">Due: {t.dueDate}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <StatusBadge status={t.priority} />
                  <StatusBadge status={t.status} />
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setSelected(t); setViewOpen(true); }}><Eye className="h-4 w-4" /></Button>
                  {t.status !== "completed" && (
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-success" onClick={() => toast.success("Task marked as completed!")}><CheckCircle2 className="h-4 w-4" /></Button>
                  )}
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
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground">Priority</p><StatusBadge status={selected.priority} /></div>
                <div><p className="text-muted-foreground">Status</p><StatusBadge status={selected.status} /></div>
                <div><p className="text-muted-foreground">Due Date</p><p className="font-medium">{selected.dueDate}</p></div>
                <div><p className="text-muted-foreground">Placement</p><p className="font-medium">{selected.placementId}</p></div>
              </div>
              <div><p className="text-muted-foreground mb-1">Description</p><p className="p-3 rounded-lg bg-muted/50">{selected.description}</p></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
