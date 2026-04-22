import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { mockExams } from "@/data/mockData";
import { Clock, CheckCircle2, ChevronRight, ChevronLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function TakeExamPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const exam = mockExams.find(e => e.id === id);
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(exam ? exam.durationMinutes * 60 : 3600); // in seconds
  const [submitOpen, setSubmitOpen] = useState(false);

  useEffect(() => {
    if (!exam) {
      navigate("/internship-student/exams");
      return;
    }
  }, [exam, navigate]);

  const answeredCount = Object.keys(answers).length;
  const isLast = currentIdx === exam.questions.length - 1;

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error("Time expired. Auto-submitting exam...");
          setTimeout(() => {
            navigate("/internship-student/exams");
            toast.success("Exam Results: 66% (Auto Graded based on your answers)");
          }, 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  if (!exam) return null;
  const currentQ = exam.questions[currentIdx];

  const handleFinalSubmit = () => {
    setSubmitOpen(false);
    toast.success("Exam submitted successfully!");
    navigate("/internship-student/exams");
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!currentQ) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-bold">No questions available.</h2>
        <Button onClick={() => navigate("/internship-student/exams")}>Return</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-card border shadow-sm sticky top-4 z-10 transition-all">
        <div>
          <h1 className="text-lg font-bold line-clamp-1">{exam.title}</h1>
          <p className="text-muted-foreground text-xs">Answered: {answeredCount} / {exam.totalQuestions}</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold text-lg ${timeLeft < 300 ? "bg-rose-500/10 text-rose-600 animate-pulse" : "bg-muted"}`}>
          <Clock className="h-5 w-5" />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-6">
          <Card className="shadow-card border-none min-h-[300px]">
            <CardHeader className="pb-4 border-b">
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span className="font-semibold uppercase tracking-wider">Question {currentIdx + 1}</span>
                <span className="px-2 py-0.5 rounded bg-muted text-[10px] uppercase font-bold">{currentQ.difficulty}</span>
              </div>
              <CardTitle className="text-lg pt-4 leading-relaxed">{currentQ.text}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <RadioGroup 
                value={answers[currentQ.id] || ""} 
                onValueChange={(val) => setAnswers(prev => ({...prev, [currentQ.id]: val}))}
                className="space-y-3"
              >
                {currentQ.options.map((opt, i) => (
                  <div key={i} className={`flex items-center space-x-3 space-y-0 rounded-lg border p-4 cursor-pointer transition-all ${answers[currentQ.id] === opt ? "bg-primary/5 border-primary shadow-sm" : "hover:bg-muted/50"}`} onClick={() => setAnswers(prev => ({...prev, [currentQ.id]: opt}))}>
                    <RadioGroupItem value={opt} id={`opt-${i}`} />
                    <Label htmlFor={`opt-${i}`} className="font-normal cursor-pointer flex-1 text-base">{opt}</Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center">
            <Button variant="outline" disabled={currentIdx === 0} onClick={() => setCurrentIdx(prev => prev - 1)}>
              <ChevronLeft className="h-4 w-4 mr-2" /> Previous
            </Button>
            {isLast ? (
              <Button className="gradient-primary px-8" onClick={() => setSubmitOpen(true)}>
                <CheckCircle2 className="h-4 w-4 mr-2" /> Complete Exam
              </Button>
            ) : (
              <Button className="gradient-primary" onClick={() => setCurrentIdx(prev => prev + 1)}>
                Next <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Question Navigator Panel */}
        <div className="hidden md:block">
          <Card className="shadow-card border-none sticky top-24">
            <CardHeader className="pb-3 text-sm font-semibold">Question Navigator</CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="grid grid-cols-4 gap-2">
                {exam.questions.map((q, i) => {
                  const isAnswered = !!answers[q.id];
                  const isCurrent = currentIdx === i;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIdx(i)}
                      className={`h-10 rounded-md text-xs font-bold transition-all ${
                        isCurrent ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
                      } ${
                        isAnswered ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={submitOpen} onOpenChange={setSubmitOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Examination</DialogTitle>
            <DialogDescription>
              Are you sure you want to complete this exam? You cannot return once submitted.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3 text-sm">
             <div className="flex justify-between p-3 rounded bg-muted/50">
               <span>Questions Answered:</span>
               <span className={`font-bold ${answeredCount < exam.totalQuestions ? "text-amber-500" : "text-emerald-500"}`}>
                 {answeredCount} / {exam.totalQuestions}
               </span>
             </div>
             {answeredCount < exam.totalQuestions && (
               <p className="text-amber-600 bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg flex items-center gap-2">
                 <AlertCircle className="h-4 w-4" /> You have unanswered questions.
               </p>
             )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitOpen(false)}>Return to Exam</Button>
            <Button className="gradient-primary" onClick={handleFinalSubmit}>Submit Final</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
