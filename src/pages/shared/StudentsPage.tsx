import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatusBadge from "@/components/shared/StatusBadge";
import { mockPlacements } from "@/data/mockData";
import { Search, Eye, User, Building2, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Placement } from "@/types";
import { mockLogbooks, mockAttendance, mockGrades, mockTasks } from "@/data/mockData";

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<Placement | null>(null);

  const filtered = mockPlacements.filter(p => p.studentName.toLowerCase().includes(search.toLowerCase()));

  const getStudentStats = (studentId: string) => {
    const logbooks = mockLogbooks.filter(l => l.studentId === studentId);
    const attendance = mockAttendance.filter(a => a.studentId === studentId);
    const grade = mockGrades.find(g => g.studentId === studentId);
    const tasks = mockTasks.filter(t => t.assignedTo === studentId);
    const presentDays = attendance.filter(a => a.status === "present" || a.status === "late").length;
    return {
      logbooks: logbooks.length,
      approvedLogbooks: logbooks.filter(l => l.status === "approved").length,
      attendanceRate: attendance.length > 0 ? Math.round((presentDays / attendance.length) * 100) : 0,
      tasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === "completed").length,
      grade: grade?.letterGrade || "Pending",
      finalGrade: grade?.finalGrade || 0,
    };
  };

  return (
    <div className="space-y-6 animate-in">
      <div><h1 className="text-2xl font-bold">Students</h1><p className="text-muted-foreground text-sm">All internship students</p></div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search students..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => {
          const stats = getStudentStats(p.studentId);
          return (
            <Card key={p.id} className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer" onClick={() => { setSelected(p); setViewOpen(true); }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                    {p.studentName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{p.studentName}</p>
                    <p className="text-xs text-muted-foreground">{p.companyName}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{p.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${p.progress}%` }} /></div>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-center">
                    <div className="p-1.5 rounded bg-muted/50"><p className="font-medium">{stats.logbooks}</p><p className="text-muted-foreground">Logbooks</p></div>
                    <div className="p-1.5 rounded bg-muted/50"><p className="font-medium">{stats.attendanceRate}%</p><p className="text-muted-foreground">Attendance</p></div>
                    <div className="p-1.5 rounded bg-muted/50"><p className="font-medium">{stats.grade}</p><p className="text-muted-foreground">Grade</p></div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <StatusBadge status={p.status} />
                  <Button size="sm" variant="ghost" className="h-7"><Eye className="h-3.5 w-3.5 mr-1" /> View</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Student Detail Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Student Profile</DialogTitle></DialogHeader>
          {selected && (() => {
            const stats = getStudentStats(selected.studentId);
            return (
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xl font-bold">
                    {selected.studentName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-lg font-bold">{selected.studentName}</p>
                    <p className="text-muted-foreground">{selected.companyName}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-muted-foreground" /><div><p className="text-muted-foreground">Company</p><p className="font-medium">{selected.companyName}</p></div></div>
                  <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /><div><p className="text-muted-foreground">Advisor</p><p className="font-medium">{selected.advisorName}</p></div></div>
                  <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /><div><p className="text-muted-foreground">Supervisor</p><p className="font-medium">{selected.supervisorName}</p></div></div>
                  <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-muted-foreground" /><div><p className="text-muted-foreground">Grade</p><p className="font-bold">{stats.grade} ({stats.finalGrade})</p></div></div>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Period: {selected.startDate} — {selected.endDate}</p>
                  <div className="flex items-center gap-3">
                    <div className="h-3 flex-1 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${selected.progress}%` }} /></div>
                    <span className="font-medium">{selected.progress}%</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50 text-center"><p className="text-lg font-bold">{stats.logbooks}</p><p className="text-xs text-muted-foreground">Logbooks</p></div>
                  <div className="p-3 rounded-lg bg-muted/50 text-center"><p className="text-lg font-bold">{stats.attendanceRate}%</p><p className="text-xs text-muted-foreground">Attendance</p></div>
                  <div className="p-3 rounded-lg bg-muted/50 text-center"><p className="text-lg font-bold">{stats.completedTasks}/{stats.tasks}</p><p className="text-xs text-muted-foreground">Tasks Done</p></div>
                  <div className="p-3 rounded-lg bg-muted/50 text-center"><p className="text-lg font-bold">{stats.approvedLogbooks}</p><p className="text-xs text-muted-foreground">Approved</p></div>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
