import StatsCard from "@/components/shared/StatsCard";
import StatusBadge from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, Star, Calendar, Eye, Info, AlertCircle, ShieldAlert, CheckCircle2, Target, BarChart3, UserCheck, Scale } from "lucide-react";
import { mockPlacements, mockLogbooks, mockEvaluations, mockCalendarEvents } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { analyticsService } from "@/services/analyticsService";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuthStore } from "@/stores/authStore";

export default function AdvisorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  // Dual-role context handling
  const [activeContext, setActiveContext] = useState<"advisor" | "evaluator">("advisor");

  const insights = analyticsService.getAdvisorInsights();
  
  // Advisor Specific Data
  const myStudentsCount = 3;
  const pendingLogbooks = mockLogbooks.filter(l => l.status === "submitted").length;
  const advisorEvaluations = mockEvaluations.filter(e => e.evaluatorRole === "advisor").length;
  
  // Evaluator Specific Data
  const assignedEvaluationsCount = mockPlacements.length; // mock all as assigned
  const pendingEvaluationsCount = 2; // mock pending
  const completedEvaluationsCount = mockEvaluations.filter(e => e.evaluatorRole === "evaluator").length;
  const upcomingDefenses = mockCalendarEvents.filter(e => e.type === "defense").length;

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "danger": return <ShieldAlert className="h-4 w-4 text-destructive" />;
      case "warning": return <AlertCircle className="h-4 w-4 text-warning" />;
      case "success": return <CheckCircle2 className="h-4 w-4 text-success" />;
      default: return <Info className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Faculty Dashboard</h1>
          <p className="text-muted-foreground text-sm">Welcome back, {user?.name}</p>
        </div>
        
        {/* Context Switcher */}
        <div className="bg-muted/50 p-1 rounded-lg inline-flex">
          <Tabs value={activeContext} onValueChange={(v) => setActiveContext(v as "advisor" | "evaluator")}>
            <TabsList className="grid w-[240px] grid-cols-2">
              <TabsTrigger value="advisor" className="gap-2 text-xs"><UserCheck className="h-3.5 w-3.5" /> Advisor Role</TabsTrigger>
              <TabsTrigger value="evaluator" className="gap-2 text-xs"><Scale className="h-3.5 w-3.5" /> Evaluator Role</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {activeContext === "advisor" ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Auto Insights Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border bg-card shadow-sm">
                <div className="flex-shrink-0">{getInsightIcon(insight.type)}</div>
                <p className="text-sm font-medium flex-1">{insight.message}</p>
                {insight.link && (
                   <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={() => navigate(insight.link!)}>Action</Button>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="cursor-pointer" onClick={() => navigate("/internship-advisor/students")}><StatsCard title="Assigned Students" value={myStudentsCount} icon={Users} /></div>
            <div className="cursor-pointer" onClick={() => navigate("/internship-advisor/logbooks")}><StatsCard title="Pending Logbooks" value={pendingLogbooks} icon={BookOpen} trend={{ value: 2, positive: false }} description="need review" /></div>
            <div className="cursor-pointer" onClick={() => navigate("/internship-advisor/evaluations")}><StatsCard title="Evaluations Done" value={advisorEvaluations} icon={Star} /></div>
            <div className="cursor-pointer" onClick={() => navigate("/internship-advisor/calendar")}><StatsCard title="Upcoming Defenses" value={upcomingDefenses} icon={Calendar} /></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div><CardTitle className="text-base">Recent Logbook Submissions</CardTitle><CardDescription>From your assigned students</CardDescription></div>
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
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div><CardTitle className="text-base">Student Progress</CardTitle><CardDescription>Internship completion status</CardDescription></div>
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
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Assigned Evaluations" value={assignedEvaluationsCount} icon={Users} />
            <StatsCard title="Pending Review" value={pendingEvaluationsCount} icon={AlertCircle} trend={{ value: 2, positive: false }} description="need grading" />
            <StatsCard title="Evaluations Completed" value={completedEvaluationsCount} icon={CheckCircle2} />
            <StatsCard title="Upcoming Defenses" value={upcomingDefenses} icon={Calendar} description="next 7 days" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="shadow-card border-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>Pending Evaluations</span>
                  <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => navigate("/internship-advisor/evaluations")}>Evaluate All</Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockPlacements.filter(p => !mockEvaluations.some(e => e.placementId === p.id && e.evaluatorRole === "evaluator")).slice(0, 3).map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-semibold text-sm">{p.studentName}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><Target className="h-3 w-3" /> {p.companyName}</p>
                    </div>
                    <Button size="sm" className="gradient-primary h-8 text-xs gap-1" onClick={() => navigate("/internship-advisor/evaluations")}><Star className="h-3 w-3" /> Evaluate</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card className="shadow-card border-none bg-blue-50/50 dark:bg-blue-950/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-blue-700 dark:text-blue-400 flex items-center gap-2"><Target className="h-4 w-4" /> Defense Schedule</CardTitle>
                <CardDescription>Your upcoming evaluator duties</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockCalendarEvents.filter(e => e.type === "defense").slice(0, 3).map(e => (
                  <div key={e.id} className="flex gap-3 bg-card p-3 rounded-lg border border-blue-100 dark:border-blue-900 shadow-sm">
                    <div className="flex flex-col items-center justify-center p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-700 dark:text-blue-300 min-w-[60px]">
                      <span className="text-lg font-bold leading-none">{e.date.split("-")[2]}</span>
                      <span className="text-[10px] uppercase font-semibold">Apr</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{e.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{e.time}</p>
                    </div>
                    <Button size="icon" variant="ghost" className="h-8 w-8 self-center" onClick={() => navigate("/internship-advisor/defense")}><Eye className="h-4 w-4" /></Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

