import StatsCard from "@/components/shared/StatsCard";
import StatusBadge from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, BookOpen, Clock, BarChart3, CheckCircle2, Eye } from "lucide-react";
import { mockLogbooks, mockTasks, mockAttendance } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

const PROGRESS_STEPS = [
  { step: 1, label: "Placement assigned", done: true },
  { step: 2, label: "Logbooks submitted", done: true },
  { step: 3, label: "Attendance recorded", done: true },
  { step: 4, label: "Report submitted", done: false },
  { step: 5, label: "Report approved", done: false },
  { step: 6, label: "Defense scheduled", done: false },
  { step: 7, label: "Evaluation completed", done: false },
  { step: 8, label: "Grade published", done: false },
];

export default function StudentDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <p className="text-muted-foreground text-sm">Track your internship progress</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cursor-pointer" onClick={() => navigate("/internship-student/internship")}><StatsCard title="Internship Progress" value="65%" icon={Briefcase} /></div>
        <div className="cursor-pointer" onClick={() => navigate("/internship-student/logbooks")}><StatsCard title="Logbooks Submitted" value={mockLogbooks.filter(l => l.studentId === "u5").length} icon={BookOpen} /></div>
        <StatsCard title="Attendance Rate" value="95%" icon={Clock} />
        <div className="cursor-pointer" onClick={() => navigate("/internship-student/tasks")}><StatsCard title="Active Tasks" value={mockTasks.filter(t => t.assignedTo === "u5" && t.status !== "completed").length} icon={BarChart3} /></div>
      </div>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">Internship Progress</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 items-start sm:items-center justify-between">
            {PROGRESS_STEPS.map((s) => (
              <div key={s.step} className="flex items-center gap-2 sm:flex-col sm:gap-1">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${s.done ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {s.done ? <CheckCircle2 className="h-4 w-4" /> : s.step}
                </div>
                <span className={`text-xs text-center max-w-[80px] ${s.done ? "font-medium" : "text-muted-foreground"}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">My Logbooks</CardTitle>
            <Button size="sm" variant="outline" onClick={() => navigate("/internship-student/logbooks")}>View All</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockLogbooks.filter(l => l.studentId === "u5").map((l) => (
              <div key={l.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => navigate("/internship-student/logbooks")}>
                <div>
                  <p className="font-medium text-sm">{l.title}</p>
                  <p className="text-xs text-muted-foreground">{l.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={l.status} />
                  <Button size="icon" variant="ghost" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">My Tasks</CardTitle>
            <Button size="sm" variant="outline" onClick={() => navigate("/internship-student/tasks")}>View All</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockTasks.filter(t => t.assignedTo === "u5").map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => navigate("/internship-student/tasks")}>
                <div>
                  <p className="font-medium text-sm">{t.title}</p>
                  <p className="text-xs text-muted-foreground">Due: {t.dueDate}</p>
                </div>
                <div className="flex gap-2">
                  <StatusBadge status={t.priority} />
                  <StatusBadge status={t.status} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate("/internship-student/grades")}>View Grades</Button>
        <Button variant="outline" onClick={() => navigate("/internship-student/documents")}>My Documents</Button>
        <Button variant="outline" onClick={() => navigate("/internship-student/complaints")}>Complaints</Button>
        <Button className="gradient-primary" onClick={() => navigate("/internship-student/submit-report")}>Submit Report</Button>
      </div>
    </div>
  );
}
