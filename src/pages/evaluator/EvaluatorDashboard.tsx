import StatsCard from "@/components/shared/StatsCard";
import StatusBadge from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Users, Star, Calendar, Eye } from "lucide-react";
import { mockEvaluations, mockCalendarEvents } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

export default function EvaluatorDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-bold">Evaluator Dashboard</h1>
        <p className="text-muted-foreground text-sm">Manage evaluations and defenses</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cursor-pointer" onClick={() => navigate("/internship-evaluator/evaluations")}><StatsCard title="Pending Evaluations" value={2} icon={Star} /></div>
        <div className="cursor-pointer" onClick={() => navigate("/internship-evaluator/defense")}><StatsCard title="Scheduled Defenses" value={1} icon={Target} /></div>
        <div className="cursor-pointer" onClick={() => navigate("/internship-evaluator/students")}><StatsCard title="Students Evaluated" value={mockEvaluations.length} icon={Users} /></div>
        <div className="cursor-pointer" onClick={() => navigate("/internship-evaluator/calendar")}><StatsCard title="Upcoming Events" value={mockCalendarEvents.length} icon={Calendar} /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Evaluations</CardTitle>
            <Button size="sm" variant="outline" onClick={() => navigate("/internship-evaluator/evaluations")}>View All</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockEvaluations.map((e) => (
              <div key={e.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => navigate("/internship-evaluator/evaluations")}>
                <div>
                  <p className="font-medium text-sm">{e.studentName}</p>
                  <p className="text-xs text-muted-foreground">Score: {e.score}/100 · {e.evaluatorRole}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={e.status} />
                  <Button size="icon" variant="ghost" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Upcoming Defenses</CardTitle>
            <Button size="sm" variant="outline" onClick={() => navigate("/internship-evaluator/defense")}>View All</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockCalendarEvents.filter(e => e.type === "defense").map((e) => (
              <div key={e.id} className="p-3 rounded-lg border hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => navigate("/internship-evaluator/defense")}>
                <p className="font-medium text-sm">{e.title}</p>
                <p className="text-xs text-muted-foreground">{e.date} at {e.time}</p>
                <p className="text-xs text-muted-foreground mt-1">Panel: {e.participants.join(", ")}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
