import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsCard from "@/components/shared/StatsCard";
import { reportService, type AutoReport } from "@/services/reportService";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Users, Building2, TrendingUp, Award, Download, RefreshCw, FileText, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { mockPlacements } from "@/data/mockData";

const monthlyData = [
  { month: "Sep", students: 15 }, { month: "Oct", students: 22 }, { month: "Nov", students: 18 },
  { month: "Dec", students: 10 }, { month: "Jan", students: 25 }, { month: "Feb", students: 30 },
  { month: "Mar", students: 28 }, { month: "Apr", students: 20 },
];

const gradeDistribution = [
  { grade: "A", count: 8 }, { grade: "A-", count: 5 }, { grade: "B+", count: 7 },
  { grade: "B", count: 4 }, { grade: "B-", count: 3 }, { grade: "C+", count: 2 }, { grade: "C", count: 1 },
];

const statusData = [
  { name: "Active", value: 3, color: "hsl(var(--primary))" },
  { name: "Completed", value: 1, color: "hsl(142, 71%, 45%)" },
  { name: "Pending", value: 2, color: "hsl(38, 92%, 50%)" },
];

export default function ReportsPage() {
  const [reports, setReports] = useState<AutoReport[]>([]);
  const [generating, setGenerating] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<AutoReport | null>(null);
  const [studentReportOpen, setStudentReportOpen] = useState(false);
  const [selectedStudentReport, setSelectedStudentReport] = useState<AutoReport | null>(null);

  const generateAllReports = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1500));
    const generated = reportService.generateAll();
    setReports(generated);
    setGenerating(false);
    toast.success(`${generated.length} reports generated automatically!`);
  };

  const generateStudentReport = async (studentId: string) => {
    const report = reportService.generateStudentProgress(studentId);
    setSelectedStudentReport(report);
    setStudentReportOpen(true);
    toast.success("Student progress report generated!");
  };

  const REPORT_TYPE_LABELS: Record<string, string> = {
    program_overview: "Program Overview",
    placement_summary: "Placement Summary",
    attendance_summary: "Attendance Summary",
    evaluation_summary: "Evaluation Summary",
    student_progress: "Student Progress",
    task_progress: "Task Performance",
    risk_alert: "Risk & Alerts",
    grade_calculation: "Grade Analysis",
    weekly_summary: "Weekly Summary",
    completion_report: "Program Completion",
    logbook_activity: "Logbook Activity",
    attendance_detailed: "Attendance Detail",
    report_lifecycle: "Report Lifecycle",
    defense_schedule: "Defense Schedule",
    complaint_summary: "Complaint Summary",
    comm_activity: "Communication Audit",
    doc_submission: "Document Status",
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Reports & Analytics</h1><p className="text-muted-foreground text-sm">Auto-generated program insights</p></div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => toast.success("Reports exported!")}><Download className="h-4 w-4" /> Export All</Button>
          <Button className="gradient-primary gap-2" onClick={generateAllReports} disabled={generating}>
            <RefreshCw className={`h-4 w-4 ${generating ? "animate-spin" : ""}`} /> {generating ? "Generating..." : "Auto-Generate Reports"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="analytics">
        <TabsList>
          <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
          <TabsTrigger value="auto-reports">Auto Reports ({reports.length})</TabsTrigger>
          <TabsTrigger value="student-reports">Student Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Total Students" value={30} icon={Users} trend={{ value: 15, positive: true }} />
            <StatsCard title="Active Companies" value={12} icon={Building2} />
            <StatsCard title="Completion Rate" value="87%" icon={TrendingUp} trend={{ value: 5, positive: true }} />
            <StatsCard title="Avg Grade" value="B+" icon={Award} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="shadow-card">
              <CardHeader><CardTitle className="text-base">Students Over Time</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={monthlyData}>
                    <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="students" stroke="hsl(234, 89%, 63%)" strokeWidth={2} dot={{ fill: "hsl(234, 89%, 63%)" }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardHeader><CardTitle className="text-base">Grade Distribution</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={gradeDistribution}>
                    <XAxis dataKey="grade" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-base">Placement Status Distribution</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auto-reports" className="space-y-4 mt-4">
          {reports.length === 0 && (
            <Card className="shadow-card">
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No auto-reports generated yet. Click "Auto-Generate Reports" to create reports from system data.</p>
              </CardContent>
            </Card>
          )}
          {reports.map((r, i) => (
            <Card key={i} className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer" onClick={() => { setSelectedReport(r); setViewOpen(true); }}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><FileText className="h-5 w-5 text-primary" /></div>
                  <div>
                    <p className="font-medium">{r.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Generated: {new Date(r.generatedAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-full bg-muted text-xs font-medium">{REPORT_TYPE_LABELS[r.type]}</span>
                  <Button size="sm" variant="outline" className="gap-1" onClick={(e) => { e.stopPropagation(); toast.success("Report downloaded!"); }}><Download className="h-3.5 w-3.5" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="student-reports" className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground">Click a student to auto-generate their individual progress report.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockPlacements.map(p => (
              <Card key={p.id} className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer" onClick={() => generateStudentReport(p.studentId)}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">{p.studentName.charAt(0)}</div>
                    <div>
                      <p className="font-medium">{p.studentName}</p>
                      <p className="text-xs text-muted-foreground">{p.companyName}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${p.progress}%` }} /></div>
                      <span className="text-xs">{p.progress}%</span>
                    </div>
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1"><FileText className="h-3 w-3" /> Generate</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Auto Report View */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{selectedReport?.title}</DialogTitle></DialogHeader>
          {selectedReport && (
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-muted-foreground">Report Type</span>
                <span className="font-medium">{REPORT_TYPE_LABELS[selectedReport.type]}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-muted-foreground">Generated</span>
                <span className="font-medium">{new Date(selectedReport.generatedAt).toLocaleString()}</span>
              </div>
              <div className="p-4 rounded-lg border">
                <p className="text-muted-foreground mb-2 font-medium">Report Data</p>
                <pre className="text-xs bg-muted/50 p-3 rounded overflow-x-auto whitespace-pre-wrap">{JSON.stringify(selectedReport.data, null, 2)}</pre>
              </div>
              <Button className="w-full gradient-primary gap-2" onClick={() => toast.success("Report downloaded!")}><Download className="h-4 w-4" /> Download Report</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Student Report View */}
      <Dialog open={studentReportOpen} onOpenChange={setStudentReportOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{selectedStudentReport?.title}</DialogTitle></DialogHeader>
          {selectedStudentReport && (
            <div className="space-y-3 text-sm">
              {Object.entries(selectedStudentReport.data).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-2 rounded border">
                  <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="font-medium">{String(value)}</span>
                </div>
              ))}
              <Button className="w-full gradient-primary gap-2" onClick={() => toast.success("Student report downloaded!")}><Download className="h-4 w-4" /> Download Report</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
