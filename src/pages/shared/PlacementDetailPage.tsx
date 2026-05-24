import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatusBadge from "@/components/shared/StatusBadge";
import { mockPlacements, mockLogbooks, mockAttendance, mockTasks, mockEvaluations } from "@/data/mockData";
import {
  Building2, User, Calendar, Clock, BookOpen,
  CheckSquare, Star, ArrowLeft, Download,
  Mail, Phone, MapPin, Briefcase, TrendingUp,
  FileText, Activity, ShieldCheck
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";

export default function PlacementDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const found = mockPlacements.find((p) => p.id === id);
  const placement =
    user?.role === "internship_advisor" && user.id
      ? found && found.advisorId === user.id
        ? found
        : undefined
      : found;

  if (!placement) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3 text-muted-foreground">
        <p>Placement not found or you do not have access.</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Go back
        </Button>
      </div>
    );
  }

  const studentLogbooks = mockLogbooks.filter((l) => l.studentId === placement.studentId);
  const studentAttendance = mockAttendance.filter((a) => a.studentId === placement.studentId);
  const studentTasks = mockTasks.filter((t) => t.assignedTo === placement.studentId);
  const studentEvaluations = mockEvaluations.filter((e) => e.placementId === placement.id);

  const presentDays = studentAttendance.filter(a => a.status === "present" || a.status === "late").length;
  const attendanceRate = studentAttendance.length > 0 ? Math.round((presentDays / studentAttendance.length) * 100) : 0;
  const completedTasks = studentTasks.filter(t => t.status === "completed").length;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full hover:bg-primary/10 hover:text-primary transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold tracking-tight">{placement.studentName}'s Journey</h1>
              <StatusBadge status={placement.status} />
            </div>
            <p className="text-muted-foreground text-sm font-medium">Internship Experience at <span className="text-primary font-semibold">{placement.companyName}</span></p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-full gap-2 border-primary/20 hover:bg-primary/5 hover:border-primary active:scale-95 transition-all"
            onClick={() => {
              toast.success("Preparing export...", { description: "Your report will be ready in a moment." });
              setTimeout(() => toast.success("Download ready!", { icon: <Download className="h-4 w-4" /> }), 1500);
            }}
          >
            <Download className="h-4 w-4" /> Export Dossier
          </Button>
          <Button
            className="rounded-full gradient-primary shadow-lg shadow-primary/20 active:scale-95 transition-all gap-2"
            onClick={() => navigate("/messages")}
          >
            <Mail className="h-4 w-4" /> Contact
          </Button>
        </div>
      </div>

      {user?.role !== "internship_advisor" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Logbooks", value: studentLogbooks.length, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Attendance", value: `${attendanceRate}%`, icon: Clock, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "Tasks Done", value: `${completedTasks}/${studentTasks.length}`, icon: CheckSquare, color: "text-amber-500", bg: "bg-amber-500/10" },
            { label: "Eval Score", value: studentEvaluations.length > 0 ? `${studentEvaluations[0].score}%` : "---", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10" },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden group hover:shadow-md transition-all">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Column */}
        <div className="space-y-6">
          <Card className="shadow-elevated border-none overflow-hidden group">
            <div className="h-28 bg-gradient-to-br from-primary via-primary/80 to-blue-600 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            </div>
            <CardContent className="pt-0 relative px-6">
              <div className="absolute -top-10 left-6">
                <div className="h-20 w-20 rounded-2xl bg-card shadow-xl border-[4px] border-card flex items-center justify-center text-2xl font-bold text-primary transition-transform">
                  {placement.studentName.charAt(0)}
                </div>
              </div>
              <div className="pt-14 pb-4">
                <h3 className="text-xl font-bold tracking-tight">{placement.studentName}</h3>
                <p className="text-muted-foreground text-sm flex items-center gap-1 font-medium">
                  ID: <span className="text-primary font-mono">{placement.studentId}</span>
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-xs font-medium text-muted-foreground border border-border/50">
                    <Mail className="h-3.5 w-3.5" /> student@imem.edu
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-xs font-medium text-muted-foreground border border-border/50">
                    <Phone className="h-3.5 w-3.5" /> +251 91 123 456
                  </div>
                </div>

                <div className="mt-6 space-y-4 pt-4 border-t border-dashed">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs mb-1 font-semibold text-muted-foreground">
                      <span>Completion Roadmap</span>
                      <span className="text-primary">{placement.progress}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-blue-500"
                        style={{ width: `${placement.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-none bg-primary/5 border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                <Building2 className="h-4 w-4" /> Workplace Environment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 text-sm">
              <div className="p-4 rounded-xl bg-card border border-primary/10 shadow-sm group hover:border-primary/30 transition-colors">
                <p className="font-bold text-lg mb-0.5">{placement.companyName}</p>
                <p className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> Addis Ababa HQ
                </p>

                <div className="mt-4 grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-bold italic uppercase">Supervisor</p>
                      <p className="font-semibold">{placement.supervisorName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <Star className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-bold italic uppercase">Academic Advisor</p>
                      <p className="font-semibold">{placement.advisorName}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-1 px-1">
                <p className="text-[10px] text-muted-foreground font-bold uppercase mb-2">Duration Contract</p>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-card border border-dashed">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="font-bold text-sm">{placement.startDate} — {placement.endDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actionable Content Column */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="logbooks" className="space-y-6">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 gap-8 overflow-x-auto no-scrollbar">
              {[
                { id: "logbooks", label: "Documentation", icon: FileText },
                { id: "attendance", label: "Time Logs", icon: Activity },
                { id: "tasks", label: "Deliverables", icon: CheckSquare },
                { id: "evaluations", label: "Performance", icon: Star },
              ].map(tab => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent px-1 py-4 text-sm font-semibold flex items-center gap-2 transition-all opacity-60 data-[state=active]:opacity-100"
                >
                  <tab.icon className="h-4 w-4" /> {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="logbooks" className="mt-0 space-y-4 animate-in slide-in-from-bottom-2 duration-300">
              {studentLogbooks.length === 0 ? (
                <div className="py-20 text-center rounded-2xl border border-dashed flex flex-col items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                    <FileText className="h-6 w-6" />
                  </div>
                  <p className="font-semibold text-muted-foreground">No documentation tracks found.</p>
                </div>
              ) : (
                studentLogbooks.map((l) => (
                  <Card key={l.id} className="shadow-sm border-border/50 hover:border-primary/30 group transition-all rounded-xl overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex">
                        <div className={`w-1.5 ${l.status === 'approved' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                        <div className="flex-1 p-5 flex items-start justify-between gap-6">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold text-primary">{l.date}</span>
                              <StatusBadge status={l.status} />
                            </div>
                            <p className="text-lg font-bold tracking-tight">{l.title}</p>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-2">{l.content}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary transition-all"
                            onClick={() => navigate(`/logbooks/${l.id}`)}
                          >
                            <BookOpen className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="attendance" className="mt-0 animate-in slide-in-from-bottom-2 duration-300">
              <Card className="shadow-sm border border-border/50 rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr className="text-left text-muted-foreground border-b border-border/50 font-semibold text-xs">
                          <th className="px-6 py-4">Work Date</th>
                          <th className="px-6 py-4">Shift Start</th>
                          <th className="px-6 py-4">Shift End</th>
                          <th className="px-6 py-4 text-right">Verification</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentAttendance.map((a) => (
                          <tr key={a.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                            <td className="px-6 py-4 font-semibold text-primary">{a.date}</td>
                            <td className="px-6 py-4 font-mono font-medium">{a.checkIn}</td>
                            <td className="px-6 py-4 font-mono font-medium">{a.checkOut || "---"}</td>
                            <td className="px-6 py-4 text-right">
                              <StatusBadge status={a.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tasks" className="mt-0 space-y-4 animate-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 gap-4">
                {studentTasks.map((t) => (
                  <Card key={t.id} className="shadow-sm border border-border/50 hover:shadow-md transition-all rounded-xl group">
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`h-11 w-11 rounded-xl flex items-center justify-center transition-all ${t.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                          <CheckSquare className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-base tracking-tight group-hover:text-primary transition-colors">{t.title}</p>
                          <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Due: {t.dueDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <StatusBadge status={t.priority} />
                        <StatusBadge status={t.status} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="evaluations" className="mt-0 animate-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {studentEvaluations.map((e) => (
                  <Card key={e.id} className="shadow-md border border-border/50 rounded-2xl overflow-hidden group">
                    <CardHeader className="pb-4 bg-primary/5">
                      <div className="flex items-center justify-between mb-2">
                        <StatusBadge status={e.evaluatorRole} />
                        <span className="text-xl font-bold text-primary">{e.score}%</span>
                      </div>
                      <CardTitle className="text-base font-bold">Feedback by {e.evaluatorName}</CardTitle>
                      <CardDescription className="font-semibold text-xs text-muted-foreground">Weight: {e.weight}%</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5 p-5">
                      <div className="space-y-3">
                        {e.criteria.map(c => (
                          <div key={c.name} className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span>{c.name}</span>
                              <span className="text-primary">{c.score} <span className="text-muted-foreground font-normal">/ {c.maxScore}</span></span>
                            </div>
                            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all duration-1000"
                                style={{ width: `${(c.score / c.maxScore) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 rounded-xl bg-muted/30 border border-dashed text-xs">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Evaluator Comments</p>
                        <p className="font-medium text-muted-foreground leading-relaxed">"{e.comments}"</p>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full rounded-xl h-10 font-bold uppercase text-[11px] tracking-wide gap-2 border-primary/20 hover:bg-primary hover:text-white transition-all"
                        onClick={() => navigate(`/evaluations/${e.id}`)}
                      >
                        <Star className="h-3.5 w-3.5" /> View Full Appraisal
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

