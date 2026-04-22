import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { mockExams, mockSubmissions } from "@/data/mockData";
import { Plus, Settings, Lock, Upload, Sparkles, FileText, Calendar, Clock, BarChart3, Users, PlayCircle, Eye, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { Exam } from "@/types";

export default function ExamManagementPage() {
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  const activeExams = mockExams.filter(e => e.status !== "Draft");
  const draftExams = mockExams.filter(e => e.status === "Draft");

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Holistic Examination System</h1>
          <p className="text-muted-foreground text-sm">Create, deploy, and analyze synchronized exams</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setGenerateOpen(true)}>
            <Sparkles className="h-4 w-4" /> AI Generate Exam
          </Button>
          <Button className="gradient-primary gap-2" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" /> Create Draft
          </Button>
        </div>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Scheduled & Active</TabsTrigger>
          <TabsTrigger value="drafts">Drafts & Question Bank</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeExams.map(exam => (
              <Card key={exam.id} className="shadow-card border-none hover:shadow-elevated transition-all">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{exam.title}</CardTitle>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      exam.status === "Active" ? "bg-emerald-100 text-emerald-700" :
                      exam.status === "Scheduled" ? "bg-blue-100 text-blue-700" :
                      "bg-slate-100 text-slate-700"
                    }`}>
                      {exam.status}
                    </span>
                  </div>
                  <CardDescription className="flex gap-1.5 flex-wrap mt-2">
                    {exam.courses.map(c => <span key={c} className="px-1.5 py-0.5 rounded bg-muted text-[10px]">{c}</span>)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{new Date(exam.scheduledStart!).toLocaleDateString()}</div>
                    <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{exam.durationMinutes} mins</div>
                    <div className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" />{exam.totalQuestions} Qs</div>
                    <div className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" />Secured</div>
                  </div>
                  <div className="flex gap-2">
                    {exam.status === "Active" ? (
                      <Button size="sm" variant="outline" className="w-full text-xs text-emerald-600 border-emerald-200 bg-emerald-50" onClick={() => navigate(`/department-head/exams/${exam.id}/monitor`)}><PlayCircle className="h-3.5 w-3.5 mr-1" /> Monitor Live</Button>
                    ) : exam.status === "Completed" ? (
                      <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => { setSelectedExam(exam); setAnalyticsOpen(true); }}><BarChart3 className="h-3.5 w-3.5 mr-1" /> View Results</Button>
                    ) : (
                      <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => navigate(`/department-head/exams/${exam.id}/edit`)}><Settings className="h-3.5 w-3.5 mr-1" /> Edit Schedule</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {draftExams.map(exam => (
              <Card key={exam.id} className="shadow-card border-none hover:shadow-elevated transition-all border-dashed">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base text-muted-foreground">{exam.title}</CardTitle>
                    <span className="px-2 py-0.5 rounded bg-muted text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Draft</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <div className="flex items-center gap-2 text-xs">
                    <FileText className="h-3.5 w-3.5" /> {exam.totalQuestions} Questions Drafted
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => navigate(`/department-head/exams/${exam.id}/edit`)}><Settings className="h-3.5 w-3.5 mr-1" /> Editor</Button>
                    <Button size="sm" className="w-full text-xs gradient-primary text-white" onClick={() => navigate(`/department-head/exams/${exam.id}/edit`)}><Calendar className="h-3.5 w-3.5 mr-1" /> Release</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 mt-4">
          <Card className="shadow-card border-none">
            <CardHeader><CardTitle className="text-base">Recent Exam Analytics</CardTitle></CardHeader>
            <CardContent>
              <table className="w-full text-sm text-left">
                <thead className="text-muted-foreground border-b">
                  <tr>
                    <th className="pb-2 font-medium">Exam Title</th>
                    <th className="pb-2 font-medium">Participants</th>
                    <th className="pb-2 font-medium">Average Score</th>
                    <th className="pb-2 font-medium">Pass Rate</th>
                    <th className="pb-2 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3 font-medium">Mid-Term Software Concepts Exam</td>
                    <td className="py-3"><div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-muted-foreground" /> 45/48</div></td>
                    <td className="py-3 font-mono">75.5%</td>
                    <td className="py-3"><span className="text-emerald-600 font-bold">92%</span></td>
                    <td className="py-3">
                      <Button size="sm" variant="ghost" className="h-8" onClick={() => { setSelectedExam(activeExams[0]); setAnalyticsOpen(true); }}><BarChart3 className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Draft/Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Create New Exam Draft</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Exam Title</Label><Input placeholder="e.g. Finals Assessment 2025" /></div>
            <div className="space-y-2">
              <Label>Import Questions (Optional)</Label>
              <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Click to upload document</p>
                <p className="text-xs text-muted-foreground mt-1">Supports .docx, .pdf, .csv. We'll extract questions automatically.</p>
              </div>
            </div>
            <div className="space-y-2"><Label>Exam Password Protection</Label><Input type="password" placeholder="Set secure password for encryption" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button className="gradient-primary" onClick={() => { setCreateOpen(false); toast.success("Draft created! You can now add questions."); }}>Save Draft</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Auto Gen Dialog */}
      <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Auto-Generate Holistic Exam</DialogTitle>
            <DialogDescription>Generates an exam spanning multiple courses instantly.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Target Courses (Max 10)</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select courses..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="c1">CS301, CS302, CS405 (3 Selected)</SelectItem>
                  <SelectItem value="c2">CS101, CS102 (2 Selected)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Total Questions</Label><Input type="number" defaultValue={50} /></div>
              <div className="space-y-2">
                <Label>Difficulty Bias</Label>
                <Select defaultValue="mixed">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mixed">Mixed (Standard)</SelectItem>
                    <SelectItem value="hard">Hard (Advanced)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg text-xs space-y-2 text-muted-foreground">
              <p>Generation Rules:</p>
              <ul className="list-disc pl-4">
                <li>Questions balanced equally across 3 courses (~16 per course)</li>
                <li>Pulls from Question Bank or uses AI context</li>
                <li>Ready for review in Drafts within seconds</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGenerateOpen(false)}>Cancel</Button>
            <Button className="gradient-primary" onClick={() => { setGenerateOpen(false); toast.success("Exam generated successfully! Check your drafts."); }}>Generate Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Analytics Dialog */}
      <Dialog open={analyticsOpen} onOpenChange={setAnalyticsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Results: {selectedExam?.title}</DialogTitle></DialogHeader>
          <div className="space-y-6 text-sm">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900">
                <p className="text-xs text-muted-foreground mb-1">Average Score</p>
                <p className="text-2xl font-bold text-emerald-600">75.5%</p>
              </div>
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 dark:bg-blue-900/10 dark:border-blue-900">
                <p className="text-xs text-muted-foreground mb-1">Pass Rate</p>
                <p className="text-2xl font-bold text-blue-600">92%</p>
              </div>
              <div className="p-4 rounded-lg bg-amber-50 border border-amber-100 dark:bg-amber-900/10 dark:border-amber-900">
                <p className="text-xs text-muted-foreground mb-1">Highest Score</p>
                <p className="text-2xl font-bold text-amber-600">98%</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base">Question Analytics</h4>
              <p className="text-muted-foreground text-xs">Identifying difficult topics for curriculum improvement.</p>
              {[
                { q: "Which normal form deals with multi-valued dependencies?", rate: "35% correct", diff: "Hard" },
                { q: "React is a server-side framework by default.", rate: "88% correct", diff: "Easy" },
              ].map((q, i) => (
                <div key={i} className="flex justify-between items-start p-3 rounded-lg border bg-card">
                  <div className="flex-1 pr-4">
                    <p className="font-medium text-sm mb-1">{q.q}</p>
                    <span className="px-1.5 py-0.5 rounded bg-muted text-[10px]">{q.diff}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`font-bold ${q.rate.startsWith("35") ? "text-rose-500" : "text-emerald-500"}`}>{q.rate}</span>
                  </div>
                </div>
              ))}
            </div>

            <Button className="w-full" variant="outline" onClick={() => toast.success("Exporting detailed CSV report...")}>
              Export Full Report (CSV)
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
