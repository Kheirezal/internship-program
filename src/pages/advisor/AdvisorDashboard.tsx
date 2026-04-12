import StatsCard from "@/components/shared/StatsCard";
import StatusBadge from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, Star, Calendar, Eye, Info, AlertCircle, ShieldAlert, CheckCircle2 } from "lucide-react";
import { mockPlacements, mockLogbooks, mockEvaluations } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { analyticsService } from "@/services/analyticsService";

 export default function AdvisorDashboard() {
   const navigate = useNavigate();
   const insights = analyticsService.getAdvisorInsights();

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
        <h1 className="text-2xl font-bold">Advisor Dashboard</h1>
        <p className="text-muted-foreground text-sm">Managing your assigned internship students</p>
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
        <div className="cursor-pointer" onClick={() => navigate("/internship-advisor/students")}><StatsCard title="Assigned Students" value={3} icon={Users} /></div>
        <div className="cursor-pointer" onClick={() => navigate("/internship-advisor/logbooks")}><StatsCard title="Pending Logbooks" value={mockLogbooks.filter(l => l.status === "submitted").length} icon={BookOpen} trend={{ value: 2, positive: false }} description="need review" /></div>
        <div className="cursor-pointer" onClick={() => navigate("/internship-advisor/evaluations")}><StatsCard title="Evaluations Done" value={mockEvaluations.length} icon={Star} /></div>
        <StatsCard title="Upcoming Defenses" value={1} icon={Calendar} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Logbook Submissions</CardTitle>
            <Button size="sm" variant="outline" onClick={() => navigate("/internship-advisor/logbooks")}>View All</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockLogbooks.slice(0, 4).map((l) => (
              <div key={l.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => navigate("/internship-advisor/logbooks")}>
                <div>
                  <p className="font-medium text-sm">{l.title}</p>
                  <p className="text-xs text-muted-foreground">{l.studentName} · {l.date}</p>
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
            <CardTitle className="text-base">Student Progress</CardTitle>
            <Button size="sm" variant="outline" onClick={() => navigate("/internship-advisor/students")}>View All</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockPlacements.filter(p => p.status === "active").slice(0, 3).map((p) => (
              <div key={p.id} className="space-y-2 cursor-pointer" onClick={() => navigate("/internship-advisor/students")}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">{p.studentName.charAt(0)}</div>
                    <span className="text-sm font-medium">{p.studentName}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{p.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${p.progress}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
