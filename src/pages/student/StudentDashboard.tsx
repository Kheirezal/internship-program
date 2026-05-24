import StatsCard from "@/components/shared/StatsCard";
import StatusBadge from "@/components/shared/StatusBadge";
import StudentRoleAlertsList from "@/components/student/StudentRoleAlertsList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { analyticsService } from "@/services/analyticsService";
import { useAuthStore } from "@/stores/authStore";
import { Briefcase, BookOpen, Clock, BarChart3, CheckCircle2, Eye, Info, AlertCircle, ShieldAlert, Megaphone } from "lucide-react";
import { mockLogbooks, mockTasks, mockStudentRoleAlerts } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

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

const PROGRESS_ROWS = [PROGRESS_STEPS.slice(0, 4), PROGRESS_STEPS.slice(4, 8)];

function ProgressStep({ step, label, done }: (typeof PROGRESS_STEPS)[number]) {
  return (
    <div className="flex flex-col items-center gap-2 text-center px-1">
      <div
        className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold ${
          done ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        }`}
      >
        {done ? <CheckCircle2 className="h-4 w-4" /> : step}
      </div>
      <span className={`text-xs leading-tight max-w-[5.5rem] sm:max-w-none ${done ? "font-medium" : "text-muted-foreground"}`}>
        {label}
      </span>
    </div>
  );
}

 export default function StudentDashboard() {
   const navigate = useNavigate();
   const { user } = useAuthStore();
   const studentId = user?.id || "u5";
   const insights = analyticsService.getStudentInsights(studentId);
   const roleAlerts = useMemo(
     () => mockStudentRoleAlerts.filter((a) => a.studentId === studentId),
     [studentId],
   );

   const getInsightIcon = (type: string) => {
     switch (type) {
       case "danger": return <ShieldAlert className="h-4 w-4 text-destructive" />;
       case "warning": return <AlertCircle className="h-4 w-4 text-warning" />;
       case "success": return <CheckCircle2 className="h-4 w-4 text-success" />;
       default: return <Info className="h-4 w-4 text-primary" />;
     }
   };

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <p className="text-muted-foreground text-sm">Welcome back, {user?.name}!</p>
      </div>

      {/* Auto Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, idx) => (
          <div 
            key={idx} 
            className={`flex items-center gap-3 p-3 rounded-lg border bg-card shadow-sm animate-in fade-in slide-in-from-top-2 duration-500`}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex-shrink-0">{getInsightIcon(insight.type)}</div>
            <p className="text-sm font-medium flex-1">{insight.message}</p>
            {insight.link && (
               <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={() => navigate(insight.link!)}>
                 Action
               </Button>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cursor-pointer" onClick={() => navigate("/internship-student/internship")}><StatsCard title="Internship Progress" value="65%" icon={Briefcase} /></div>
        <div className="cursor-pointer" onClick={() => navigate("/internship-student/logbooks")}><StatsCard title="Logbooks Submitted" value={mockLogbooks.filter(l => l.studentId === "u5").length} icon={BookOpen} /></div>
        <StatsCard title="Attendance Rate" value="95%" icon={Clock} />
        <div className="cursor-pointer" onClick={() => navigate("/internship-student/tasks")}><StatsCard title="Active Tasks" value={mockTasks.filter(t => t.assignedTo === "u5" && t.status !== "completed").length} icon={BarChart3} /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Internship Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {PROGRESS_ROWS.map((row, rowIndex) => (
              <div key={rowIndex} className="space-y-3">
                {rowIndex === 1 && (
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Final phase
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-2">
                  {row.map((s) => (
                    <ProgressStep key={s.step} {...s} />
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-primary" />
              Role Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StudentRoleAlertsList alerts={roleAlerts} />
          </CardContent>
        </Card>
      </div>

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
