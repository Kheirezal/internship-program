import StatsCard from "@/components/shared/StatsCard";
import StatusBadge from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  Star,
  Calendar,
  Eye,
  Info,
  AlertCircle,
  ShieldAlert,
  CheckCircle2,
  Target,
  UserCheck,
  Scale,
  FileUp,
  MapPin,
  Clock,
  MessageSquare,
  Briefcase,
  FileText,
  Bell,
  GraduationCap,
  CalendarClock,
  BookMarked,
  Lightbulb,
} from "lucide-react";
import {
  mockPlacements,
  mockLogbooks,
  mockEvaluations,
  mockCalendarEvents,
  mockStudentDocumentSubmissions,
  mockSiteVisits,
  mockMessages,
  mockActivities,
  mockAttendance,
  mockAdvisorProgressReports,
  mockFinalReportReviews,
  mockAdvisorFollowUps,
  mockDefenseReadinessReviews,
} from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { analyticsService } from "@/services/analyticsService";
import { useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/stores/authStore";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { StudentSubmissionDocType } from "@/types";

const DOC_TYPE_LABELS: Record<StudentSubmissionDocType, string> = {
  proposal: "Proposal",
  srs: "SRS",
  implementation: "Implementation",
  other: "Other",
};

function docTypeLabel(type: StudentSubmissionDocType) {
  return DOC_TYPE_LABELS[type] ?? type;
}

function formatEventMonth(date: string) {
  const d = new Date(date + "T00:00:00");
  return d.toLocaleString("en-US", { month: "short" });
}

function formatEventDay(date: string) {
  return date.split("-")[2] ?? "—";
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "Yesterday" : `${days}d ago`;
}

export default function AdvisorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const advisorId = user?.id;

  const [activeContext, setActiveContext] = useState<"advisor" | "evaluator">("advisor");

  const myPlacements = useMemo(
    () => mockPlacements.filter((p) => !advisorId || p.advisorId === advisorId),
    [advisorId]
  );
  const myPlacementIds = useMemo(() => myPlacements.map((p) => p.id), [myPlacements]);

  const insights = analyticsService.getAdvisorInsights(advisorId);

  const myLogbooks = useMemo(
    () => mockLogbooks.filter((l) => myPlacementIds.includes(l.placementId)),
    [myPlacementIds]
  );
  const pendingLogbooks = myLogbooks.filter((l) => l.status === "submitted").length;
  const advisorEvaluations = mockEvaluations.filter((e) => e.evaluatorRole === "advisor").length;

  const pendingSubmissions = mockStudentDocumentSubmissions.filter(
    (s) =>
      s.recipientRole === "internship_advisor" &&
      s.status === "pending" &&
      myPlacementIds.includes(s.placementId)
  ).length;

  const upcomingSiteVisits = mockSiteVisits.filter(
    (v) => v.status === "scheduled" && (!advisorId || v.advisorId === advisorId)
  ).length;

  const unreadMessages = mockMessages.filter(
    (m) => m.receiverId === advisorId && !m.read
  ).length;

  const lateToday = mockAttendance.filter((a) => {
    const placement = myPlacements.find((p) => p.studentId === a.studentId);
    return placement && a.status === "late";
  }).length;

  const assignedEvaluationsCount = mockPlacements.filter(
    (p) => p.evaluatorId === advisorId
  ).length;
  const pendingEvaluationsCount = mockPlacements.filter(
    (p) =>
      p.evaluatorId === advisorId &&
      !mockEvaluations.some((e) => e.placementId === p.id && e.evaluatorRole === "evaluator")
  ).length;
  const completedEvaluationsCount = mockEvaluations.filter(
    (e) => e.evaluatorRole === "evaluator" && e.evaluatorId === advisorId
  ).length;
  const upcomingDefenses = mockCalendarEvents.filter((e) => e.type === "defense").length;

  const logbookChartData = useMemo(() => {
    const counts = { submitted: 0, reviewed: 0, approved: 0, other: 0 };
    myLogbooks.forEach((l) => {
      if (l.status === "submitted") counts.submitted++;
      else if (l.status === "reviewed") counts.reviewed++;
      else if (l.status === "approved") counts.approved++;
      else counts.other++;
    });
    return [
      { name: "Pending Review", value: counts.submitted, color: "hsl(38, 92%, 50%)" },
      { name: "Reviewed", value: counts.reviewed, color: "hsl(234, 89%, 63%)" },
      { name: "Approved", value: counts.approved, color: "hsl(142, 71%, 45%)" },
      ...(counts.other > 0 ? [{ name: "Other", value: counts.other, color: "hsl(215, 16%, 47%)" }] : []),
    ].filter((d) => d.value > 0);
  }, [myLogbooks]);

  const progressChartData = useMemo(
    () =>
      myPlacements
        .filter((p) => p.status === "active")
        .map((p) => ({
          name: p.studentName.split(" ")[0],
          progress: p.progress,
        })),
    [myPlacements]
  );

  const myActivities = useMemo(
    () =>
      mockActivities
        .filter((a) => myPlacementIds.includes(a.placementId))
        .slice(0, 5),
    [myPlacementIds]
  );

  const upcomingEvents = useMemo(
    () =>
      mockCalendarEvents
        .filter((e) => ["deadline", "meeting", "site_visit", "defense"].includes(e.type))
        .slice(0, 4),
    []
  );

  const advisorSubmissions = mockStudentDocumentSubmissions.filter(
    (s) =>
      s.recipientRole === "internship_advisor" &&
      myPlacementIds.includes(s.placementId)
  );

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "danger":
        return <ShieldAlert className="h-4 w-4 text-destructive" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      default:
        return <Info className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Faculty Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Welcome back, {user?.name}
            {user?.department ? ` · ${user.department}` : ""}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="bg-muted/50 p-1 rounded-lg inline-flex self-start sm:self-auto">
            <Tabs value={activeContext} onValueChange={(v) => setActiveContext(v as "advisor" | "evaluator")}>
              <TabsList className="grid w-[240px] grid-cols-2">
                <TabsTrigger value="advisor" className="gap-2 text-xs">
                  <UserCheck className="h-3.5 w-3.5" /> Advisor
                </TabsTrigger>
                <TabsTrigger value="evaluator" className="gap-2 text-xs">
                  <Scale className="h-3.5 w-3.5" /> Evaluator
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {activeContext === "advisor" ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => navigate("/internship-advisor/logbooks")}
            >
              <BookOpen className="h-4 w-4" /> Review Logbooks
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => navigate("/internship-advisor/submissions")}
            >
              <FileUp className="h-4 w-4" /> Submissions
              {pendingSubmissions > 0 && (
                <span className="ml-1 rounded-full bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 font-semibold">
                  {pendingSubmissions}
                </span>
              )}
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => navigate("/internship-advisor/site-visits")}
            >
              <MapPin className="h-4 w-4" /> Site Visits
            </Button>
            <Button className="gradient-primary gap-2" onClick={() => navigate("/internship-advisor/oversight")}>
              <GraduationCap className="h-4 w-4" /> Academic Oversight
            </Button>
          </div>

          <Card className="shadow-card border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Core Advisor Responsibilities</CardTitle>
              <CardDescription>Your academic supervision workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  {
                    label: "Progress Reports",
                    desc: "Review summarized student progress",
                    tab: "progress",
                    icon: FileText,
                    count: mockAdvisorProgressReports.filter(
                      (r) => myPlacementIds.includes(r.placementId) && r.status === "pending_review"
                    ).length,
                  },
                  {
                    label: "Academic Relevance",
                    desc: "Monitor work vs curriculum",
                    tab: "relevance",
                    icon: GraduationCap,
                    count: 0,
                  },
                  {
                    label: "Periodic Follow-up",
                    desc: "Scheduled check-ins",
                    tab: "followup",
                    icon: CalendarClock,
                    count: mockAdvisorFollowUps.filter(
                      (f) => myPlacementIds.includes(f.placementId) && f.status === "scheduled"
                    ).length,
                  },
                  {
                    label: "Final Documentation",
                    desc: "Review final internship reports",
                    tab: "final-docs",
                    icon: BookMarked,
                    count: mockFinalReportReviews.filter(
                      (f) => myPlacementIds.includes(f.placementId) && f.status === "pending"
                    ).length,
                  },
                  {
                    label: "Defense Readiness",
                    desc: "Presentation & defense prep",
                    tab: "defense",
                    icon: Target,
                    count: mockDefenseReadinessReviews.filter(
                      (d) => myPlacementIds.includes(d.placementId) && d.status !== "ready"
                    ).length,
                  },
                  {
                    label: "Research Guidance",
                    desc: "Academic direction & mentoring",
                    tab: "guidance",
                    icon: Lightbulb,
                    count: 0,
                  },
                ].map((item) => (
                  <button
                    key={item.tab}
                    type="button"
                    onClick={() => navigate(`/internship-advisor/oversight/${item.tab}`)}
                    className="flex items-start gap-3 p-3 rounded-lg border text-left hover:bg-muted/40 hover:border-primary/30 transition-all"
                  >
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                      {item.count > 0 && (
                        <span className="text-[10px] font-bold text-primary mt-1 inline-block">
                          {item.count} needs attention
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {insights.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {insights.map((insight, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card shadow-sm"
                >
                  <div className="flex-shrink-0">{getInsightIcon(insight.type)}</div>
                  <p className="text-sm font-medium flex-1">{insight.message}</p>
                  {insight.link && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs px-2"
                      onClick={() => navigate(insight.link!)}
                    >
                      Action
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="cursor-pointer" onClick={() => navigate("/internship-advisor/students")}>
              <StatsCard title="Assigned Students" value={myPlacements.filter((p) => p.status === "active").length} icon={Users} description={`${myPlacements.length} total placements`} />
            </div>
            <div className="cursor-pointer" onClick={() => navigate("/internship-advisor/logbooks")}>
              <StatsCard
                title="Pending Logbooks"
                value={pendingLogbooks}
                icon={BookOpen}
                trend={pendingLogbooks > 0 ? { value: pendingLogbooks, positive: false } : undefined}
                description="need review"
              />
            </div>
            <div className="cursor-pointer" onClick={() => navigate("/internship-advisor/submissions")}>
              <StatsCard title="Pending Submissions" value={pendingSubmissions} icon={FileUp} description="documents to review" />
            </div>
            <div className="cursor-pointer" onClick={() => navigate("/internship-advisor/evaluations")}>
              <StatsCard title="Advisor Evaluations" value={advisorEvaluations} icon={Star} description="submitted this term" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="cursor-pointer" onClick={() => navigate("/internship-advisor/site-visits")}>
              <StatsCard title="Site Visits" value={upcomingSiteVisits} icon={MapPin} description="scheduled" />
            </div>
            <div className="cursor-pointer" onClick={() => navigate("/internship-advisor/attendance")}>
              <StatsCard title="Late Check-ins" value={lateToday} icon={Clock} description="recent records" />
            </div>
            <div className="cursor-pointer" onClick={() => navigate("/internship-advisor/messages")}>
              <StatsCard title="Unread Messages" value={unreadMessages} icon={MessageSquare} description="from students" />
            </div>
            <div className="cursor-pointer" onClick={() => navigate("/internship-advisor/calendar")}>
              <StatsCard title="Upcoming Events" value={upcomingEvents.length} icon={Calendar} description="deadlines & meetings" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Logbook Review Status</CardTitle>
                <CardDescription>Breakdown for your assigned students</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                {logbookChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={logbookChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {logbookChartData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground py-8">No logbook data yet</p>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Student Progress</CardTitle>
                <CardDescription>Active internship completion (%)</CardDescription>
              </CardHeader>
              <CardContent>
                {progressChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={progressChartData} layout="vertical" margin={{ left: 8, right: 16 }}>
                      <XAxis type="number" domain={[0, 100]} fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis type="category" dataKey="name" fontSize={12} tickLine={false} axisLine={false} width={56} />
                      <Tooltip formatter={(v: number) => [`${v}%`, "Progress"]} />
                      <Bar dataKey="progress" fill="hsl(234, 89%, 63%)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground py-8">No active placements</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base">Recent Logbook Submissions</CardTitle>
                  <CardDescription>From your assigned students</CardDescription>
                </div>
                <Button size="sm" variant="outline" onClick={() => navigate("/internship-advisor/logbooks")}>
                  View All
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {myLogbooks.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No logbooks yet</p>
                ) : (
                  myLogbooks.slice(0, 4).map((l) => (
                    <div
                      key={l.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => navigate(`/logbooks/${l.id}`)}
                    >
                      <div>
                        <p className="font-medium text-sm">{l.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {l.studentName} · {l.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={l.status} />
                        <Button size="icon" variant="ghost" className="h-7 w-7">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base">Document Submissions</CardTitle>
                  <CardDescription>Proposals and reports sent to you</CardDescription>
                </div>
                <Button size="sm" variant="outline" onClick={() => navigate("/internship-advisor/submissions")}>
                  View All
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {advisorSubmissions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No submissions yet</p>
                ) : (
                  advisorSubmissions.slice(0, 4).map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => navigate("/internship-advisor/submissions")}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{s.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          {s.studentName} · {docTypeLabel(s.documentType)}
                        </p>
                      </div>
                      <StatusBadge status={s.status} />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="shadow-card lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base">My Students</CardTitle>
                  <CardDescription>Placement overview and progress</CardDescription>
                </div>
                <Button size="sm" variant="outline" onClick={() => navigate("/internship-advisor/students")}>
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground">
                        <th className="pb-3 font-medium">Student</th>
                        <th className="pb-3 font-medium">Company</th>
                        <th className="pb-3 font-medium">Project</th>
                        <th className="pb-3 font-medium">Progress</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium" />
                      </tr>
                    </thead>
                    <tbody>
                      {myPlacements.map((p) => (
                        <tr
                          key={p.id}
                          className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                          onClick={() => navigate(`/internship-advisor/students/${p.id}`)}
                        >
                          <td className="py-3 font-medium">{p.studentName}</td>
                          <td className="py-3">{p.companyName}</td>
                          <td className="py-3 max-w-[140px] truncate text-muted-foreground">
                            {p.projectTitle ?? "—"}
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-primary"
                                  style={{ width: `${p.progress}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">{p.progress}%</span>
                            </div>
                          </td>
                          <td className="py-3">
                            <StatusBadge status={p.status} />
                          </td>
                          <td className="py-3">
                            <Button size="icon" variant="ghost" className="h-7 w-7">
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" /> Site Visits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockSiteVisits
                    .filter((v) => !advisorId || v.advisorId === advisorId)
                    .slice(0, 3)
                    .map((v) => (
                      <div
                        key={v.id}
                        className="p-3 rounded-lg border text-sm cursor-pointer hover:bg-muted/30"
                        onClick={() => navigate("/internship-advisor/site-visits")}
                      >
                        <p className="font-medium">{v.studentName}</p>
                        <p className="text-xs text-muted-foreground">{v.companyName}</p>
                        <p className="text-xs mt-1">
                          {v.scheduledDate} · {v.scheduledTime}
                        </p>
                        <div className="mt-2">
                          <StatusBadge status={v.status} />
                        </div>
                      </div>
                    ))}
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/internship-advisor/site-visits")}
                  >
                    Manage Visits
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bell className="h-4 w-4 text-primary" /> Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {myActivities.map((a) => (
                    <div key={a.id} className="text-sm border-b last:border-0 pb-2 last:pb-0">
                      <p className="font-medium leading-snug">{a.description}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {a.actor} · {relativeTime(a.timestamp)}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base">Upcoming Schedule</CardTitle>
                <CardDescription>Deadlines, meetings, and site visits</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigate("/internship-advisor/calendar")}>
                Open Calendar
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {upcomingEvents.map((e) => (
                  <div
                    key={e.id}
                    className="flex gap-3 p-3 rounded-lg border hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => navigate("/internship-advisor/calendar")}
                  >
                    <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-lg min-w-[52px]">
                      <span className="text-lg font-bold leading-none">{formatEventDay(e.date)}</span>
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                        {formatEventMonth(e.date)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm truncate">{e.title}</p>
                      <p className="text-xs text-muted-foreground">{e.time}</p>
                      <StatusBadge status={e.type} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex flex-wrap gap-2">
            <Button className="gradient-primary gap-2" onClick={() => navigate("/internship-advisor/evaluations")}>
              <Star className="h-4 w-4" /> Start Evaluation
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => navigate("/internship-advisor/defense")}>
              <Target className="h-4 w-4" /> Defense Schedule
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => navigate("/internship-advisor/grades")}>
              <Briefcase className="h-4 w-4" /> View Grades
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="cursor-pointer" onClick={() => navigate("/internship-advisor/evaluations")}>
              <StatsCard title="Assigned Evaluations" value={assignedEvaluationsCount || mockPlacements.length} icon={Users} />
            </div>
            <div className="cursor-pointer" onClick={() => navigate("/internship-advisor/evaluations")}>
              <StatsCard
                title="Pending Review"
                value={pendingEvaluationsCount}
                icon={AlertCircle}
                trend={pendingEvaluationsCount > 0 ? { value: pendingEvaluationsCount, positive: false } : undefined}
                description="need grading"
              />
            </div>
            <div className="cursor-pointer" onClick={() => navigate("/internship-advisor/evaluations")}>
              <StatsCard title="Completed" value={completedEvaluationsCount} icon={CheckCircle2} />
            </div>
            <div className="cursor-pointer" onClick={() => navigate("/internship-advisor/defense")}>
              <StatsCard title="Upcoming Defenses" value={upcomingDefenses} icon={Calendar} description="scheduled" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>Pending Evaluations</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    onClick={() => navigate("/internship-advisor/evaluations")}
                  >
                    Evaluate All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockPlacements
                  .filter(
                    (p) =>
                      !mockEvaluations.some(
                        (e) => e.placementId === p.id && e.evaluatorRole === "evaluator"
                      )
                  )
                  .slice(0, 4)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-sm">{p.studentName}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Target className="h-3 w-3" /> {p.companyName}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="gradient-primary h-8 text-xs gap-1"
                        onClick={() => navigate("/internship-advisor/evaluations")}
                      >
                        <Star className="h-3 w-3" /> Evaluate
                      </Button>
                    </div>
                  ))}
              </CardContent>
            </Card>

            <Card className="shadow-card border-none bg-blue-50/50 dark:bg-blue-950/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-blue-700 dark:text-blue-400 flex items-center gap-2">
                  <Target className="h-4 w-4" /> Defense Schedule
                </CardTitle>
                <CardDescription>Your upcoming evaluator duties</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockCalendarEvents
                  .filter((e) => e.type === "defense")
                  .slice(0, 3)
                  .map((e) => (
                    <div
                      key={e.id}
                      className="flex gap-3 bg-card p-3 rounded-lg border border-blue-100 dark:border-blue-900 shadow-sm"
                    >
                      <div className="flex flex-col items-center justify-center p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-700 dark:text-blue-300 min-w-[60px]">
                        <span className="text-lg font-bold leading-none">{formatEventDay(e.date)}</span>
                        <span className="text-[10px] uppercase font-semibold">
                          {formatEventMonth(e.date)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{e.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{e.time}</p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 self-center shrink-0"
                        onClick={() => navigate("/internship-advisor/defense")}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/internship-advisor/defense")}
                >
                  View Full Schedule
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
