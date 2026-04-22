import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockExams, mockSubmissions } from "@/data/mockData";
import { PlayCircle, Clock, FileText, Lock, ShieldCheck, HelpCircle, CheckCircle2, History } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function StudentExamsPage() {
  const navigate = useNavigate();
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);

  // Student should only see Scheduled and Active exams, plus their past submissions.
  const availableExams = mockExams.filter(e => e.status === "Active" || e.status === "Scheduled");
  
  const handleStartExam = () => {
    if (!password) {
      toast.error("Please enter the exam password.");
      return;
    }
    // Simulate password check
    if (password === "admin") {
      toast.success("Password accepted! Starting exam...");
      setPasswordOpen(false);
      navigate(`/internship-student/exams/${selectedExamId}/take`);
    } else {
      toast.error("Incorrect password.");
      setPassword("");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold">Examinations</h1>
        <p className="text-muted-foreground text-sm">Synchronized online tests and holistic assessments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2"><PlayCircle className="h-5 w-5 text-primary" /> Available Exams</h2>
          {availableExams.length === 0 ? (
            <Card className="shadow-card border-none border-dashed bg-muted/20">
               <CardContent className="p-8 text-center text-muted-foreground">
                 No exams available at the moment.
               </CardContent>
            </Card>
          ) : (
            availableExams.map(exam => (
              <Card key={exam.id} className="shadow-card border-none hover:shadow-elevated transition-all">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{exam.title}</CardTitle>
                      <CardDescription className="flex gap-1.5 flex-wrap mt-1">
                        {exam.courses.map(c => <span key={c} className="px-1.5 py-0.5 rounded bg-muted text-[10px]">{c}</span>)}
                      </CardDescription>
                    </div>
                    {exam.status === "Active" ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 animate-pulse">Live</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700">Scheduled</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{exam.durationMinutes} minutes</div>
                    <div className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" />{exam.totalQuestions} Questions</div>
                    <div className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" />Password Protected</div>
                    <div className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" />Auto-grading enabled</div>
                  </div>
                  
                  {exam.status === "Active" ? (
                    <Button className="w-full gradient-primary gap-2" onClick={() => { setSelectedExamId(exam.id); setPasswordOpen(true); }}>
                      <PlayCircle className="h-4 w-4" /> Enter Exam Password
                    </Button>
                  ) : (
                    <Button className="w-full" variant="outline" disabled>
                      Opens: {new Date(exam.scheduledStart!).toLocaleString()}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2"><History className="h-5 w-5 text-muted-foreground" /> Your Submissions</h2>
          {mockSubmissions.map(sub => (
            <Card key={sub.id} className="shadow-card border-none">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-sm">Mid-Term Software Concepts Exam</h3>
                    <p className="text-xs text-muted-foreground">{new Date(sub.submittedAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-primary">{sub.percentage.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 className="h-3.5 w-3.5" /> {sub.score} Correct</span>
                  <span className="flex items-center gap-1 text-muted-foreground"><HelpCircle className="h-3.5 w-3.5" /> {sub.totalScore} Total</span>
                  {sub.isAutoSubmitted && <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-medium">Auto-Submitted (Timeout)</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={passwordOpen} onOpenChange={(open) => { setPasswordOpen(open); if(!open) setPassword(""); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Lock className="h-5 w-5 text-primary" /> Secured Exam</DialogTitle>
            <DialogDescription>
              This exam is encrypted. Please enter the password provided by your Department Head to begin. The timer will start immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Exam Password (Try: admin)</Label>
              <Input 
                type="password" 
                placeholder="Enter password..." 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleStartExam()}
                autoFocus
              />
            </div>
            <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted/50 rounded-lg">
              <p>• Warning: Closing the window during the exam may auto-submit your answers.</p>
              <p>• Your answers are saved automatically as you progress.</p>
              <p>• Once time expires, the draft is instantly evaluated.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordOpen(false)}>Cancel</Button>
            <Button className="gradient-primary" onClick={handleStartExam}>Unlock & Start Timer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
