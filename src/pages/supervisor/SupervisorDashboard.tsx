import StatsCard from "@/components/shared/StatsCard";
import StatusBadge from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Clock, CheckSquare, Star, Info, AlertCircle, ShieldAlert, CheckCircle2 } from "lucide-react";
import { mockAttendance, mockTasks } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { analyticsService } from "@/services/analyticsService";

 export default function SupervisorDashboard() {
   const navigate = useNavigate();
   const insights = analyticsService.getSupervisorInsights();

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
        <h1 className="text-2xl font-bold">Supervisor Dashboard</h1>
        <p className="text-muted-foreground text-sm">Manage your company interns</p>
      </div>

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
                 Check
               </Button>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cursor-pointer" onClick={() => navigate("/company-supervisor/interns")}><StatsCard title="Active Interns" value={2} icon={Users} /></div>
        <div className="cursor-pointer" onClick={() => navigate("/company-supervisor/attendance")}><StatsCard title="Today's Attendance" value={`${mockAttendance.filter(a => a.status === "present").length}/${mockAttendance.length}`} icon={Clock} /></div>
        <div className="cursor-pointer" onClick={() => navigate("/company-supervisor/tasks")}><StatsCard title="Active Tasks" value={mockTasks.filter(t => t.status !== "completed").length} icon={CheckSquare} /></div>
        <div className="cursor-pointer" onClick={() => navigate("/company-supervisor/evaluation")}><StatsCard title="Evaluations" value={1} icon={Star} description="submitted" /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Attendance</CardTitle>
            <Button size="sm" variant="outline" onClick={() => navigate("/company-supervisor/attendance")}>View All</Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Student</th><th className="pb-3 font-medium">Date</th><th className="pb-3 font-medium">Check In</th><th className="pb-3 font-medium">Status</th>
                </tr></thead>
                <tbody>
                  {mockAttendance.slice(0, 4).map((a) => (
                    <tr key={a.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer" onClick={() => navigate("/company-supervisor/attendance")}>
                      <td className="py-3 font-medium">{a.studentName}</td>
                      <td className="py-3">{a.date}</td>
                      <td className="py-3 font-mono">{a.checkIn}</td>
                      <td className="py-3"><StatusBadge status={a.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Tasks</CardTitle>
            <Button size="sm" variant="outline" onClick={() => navigate("/company-supervisor/tasks")}>View All</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockTasks.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => navigate("/company-supervisor/tasks")}>
                <div>
                  <p className="font-medium text-sm">{t.title}</p>
                  <p className="text-xs text-muted-foreground">Due: {t.dueDate}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <StatusBadge status={t.priority} />
                  <StatusBadge status={t.status} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
