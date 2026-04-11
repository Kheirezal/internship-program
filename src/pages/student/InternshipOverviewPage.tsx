import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockActivities, mockPlacements } from "@/data/mockData";
import StatusBadge from "@/components/shared/StatusBadge";
import { Briefcase, Building2, User, Calendar, CheckCircle2 } from "lucide-react";

const placement = mockPlacements[0];

const TIMELINE_ICONS: Record<string, React.ElementType> = {
  logbook_submitted: Calendar,
  attendance_recorded: CheckCircle2,
  task_assigned: Briefcase,
  logbook_approved: CheckCircle2,
  evaluation_submitted: User,
};

export default function InternshipOverviewPage() {
  return (
    <div className="space-y-6 animate-in">
      <div><h1 className="text-2xl font-bold">My Internship</h1><p className="text-muted-foreground text-sm">Internship details and timeline</p></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Placement Details</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-muted-foreground" /> <span className="font-medium">{placement.companyName}</span></div>
            <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /> Advisor: {placement.advisorName}</div>
            <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /> Supervisor: {placement.supervisorName}</div>
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /> {placement.startDate} — {placement.endDate}</div>
            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${placement.progress}%` }} /></div>
              <span className="text-xs font-medium">{placement.progress}%</span>
            </div>
            <StatusBadge status={placement.status} />
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Activity Timeline</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockActivities.map((a) => {
                const Icon = TIMELINE_ICONS[a.type] || CheckCircle2;
                return (
                  <div key={a.id} className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm">{a.description}</p>
                      <p className="text-xs text-muted-foreground">{new Date(a.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
