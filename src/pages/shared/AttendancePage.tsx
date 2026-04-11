import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/shared/StatusBadge";
import { mockAttendance, mockPlacements } from "@/data/mockData";
import { Plus, Search, Eye } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Attendance } from "@/types";
import { useAuthStore } from "@/stores/authStore";

export default function AttendancePage() {
  const { user } = useAuthStore();
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<Attendance | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const isSupervisor = user?.role === "company_supervisor";
  const filtered = mockAttendance
    .filter(a => a.studentName.toLowerCase().includes(search.toLowerCase()))
    .filter(a => statusFilter === "all" || a.status === statusFilter);

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Attendance</h1><p className="text-muted-foreground text-sm">Record and track attendance</p></div>
        {isSupervisor && (
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild><Button className="gradient-primary gap-2"><Plus className="h-4 w-4" /> Record Attendance</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Record Attendance</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Student</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                    <SelectContent>{mockPlacements.map(p => <SelectItem key={p.studentId} value={p.studentId}>{p.studentName}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Date</Label><Input type="date" defaultValue={new Date().toISOString().split("T")[0]} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Check In</Label><Input type="time" defaultValue="08:30" /></div>
                  <div className="space-y-2"><Label>Check Out</Label><Input type="time" defaultValue="17:00" /></div>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                      <SelectItem value="excused">Excused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Notes (optional)</Label><Input placeholder="Additional notes" /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button className="gradient-primary" onClick={() => { setCreateOpen(false); toast.success("Attendance recorded!"); }}>Record</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search students..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="present">Present</SelectItem>
            <SelectItem value="absent">Absent</SelectItem>
            <SelectItem value="late">Late</SelectItem>
            <SelectItem value="excused">Excused</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-muted-foreground">
                <th className="p-4 font-medium">Student</th><th className="p-4 font-medium">Date</th><th className="p-4 font-medium">Check In</th><th className="p-4 font-medium">Check Out</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Notes</th><th className="p-4 font-medium">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="p-4 font-medium">{a.studentName}</td>
                    <td className="p-4">{a.date}</td>
                    <td className="p-4 font-mono">{a.checkIn}</td>
                    <td className="p-4 font-mono">{a.checkOut || "-"}</td>
                    <td className="p-4"><StatusBadge status={a.status} /></td>
                    <td className="p-4 text-muted-foreground">{a.notes || "-"}</td>
                    <td className="p-4">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setSelected(a); setViewOpen(true); }}><Eye className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Attendance Record</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground">Student</p><p className="font-medium">{selected.studentName}</p></div>
                <div><p className="text-muted-foreground">Date</p><p className="font-medium">{selected.date}</p></div>
                <div><p className="text-muted-foreground">Check In</p><p className="font-medium font-mono">{selected.checkIn}</p></div>
                <div><p className="text-muted-foreground">Check Out</p><p className="font-medium font-mono">{selected.checkOut || "N/A"}</p></div>
                <div><p className="text-muted-foreground">Status</p><StatusBadge status={selected.status} /></div>
              </div>
              {selected.notes && <div><p className="text-muted-foreground mb-1">Notes</p><p className="p-3 rounded-lg bg-muted/50">{selected.notes}</p></div>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
