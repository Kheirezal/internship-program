import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockExams } from "@/data/mockData";
import { ArrowLeft, Save, Plus, Trash2, Calendar, FileText, Settings, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function ExamEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const exam = mockExams.find(e => e.id === id);

  useEffect(() => {
    if (!exam) {
      toast.error("Exam not found.");
      navigate("/department-head/exams");
    }
  }, [exam, navigate]);

  if (!exam) return null;

  const handleSave = () => {
    toast.success("Exam draft saved successfully.");
  };

  const handleRelease = () => {
    toast.success("Exam scheduled & released. It is now active.");
    navigate("/department-head/exams");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/department-head/exams")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Exam Editor
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground">{exam.status}</span>
          </h1>
          <p className="text-muted-foreground text-sm">Managing: {exam.title}</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleSave}>
            <Save className="h-4 w-4" /> Save Draft
          </Button>
          <Button className="gradient-primary gap-2" onClick={handleRelease}>
            <PlayCircle className="h-4 w-4" /> Schedule & Release
          </Button>
        </div>
      </div>

      <Tabs defaultValue="questions">
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger value="questions" className="gap-2"><FileText className="h-4 w-4" /> Edit Questions</TabsTrigger>
          <TabsTrigger value="settings" className="gap-2"><Settings className="h-4 w-4" /> Settings & Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4 mt-4 max-w-3xl">
          <Card className="shadow-card border-none">
            <CardHeader><CardTitle className="text-base">Exam Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2"><Label>Exam Title</Label><Input defaultValue={exam.title} /></div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2"><Label>Scheduled Start</Label><Input type="datetime-local" defaultValue={exam.scheduledStart ? new Date(exam.scheduledStart).toISOString().slice(0, 16) : ""} /></div>
                 <div className="space-y-2"><Label>Duration (Minutes)</Label><Input type="number" defaultValue={exam.durationMinutes} /></div>
               </div>
               <div className="space-y-2"><Label>Exam Password</Label><Input type="password" placeholder="Leave blank to keep current password" /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4 mt-4">
          <div className="flex justify-between items-center bg-card p-4 rounded-xl border shadow-sm">
            <div className="flex gap-4 text-sm font-semibold">
               <span className="text-primary">{exam.questions?.length || 0} Total Questions</span>
               <span className="text-muted-foreground border-l pl-4">Target: {exam.totalQuestions} Questions</span>
            </div>
            <Button size="sm" className="gradient-primary gap-2" onClick={() => toast.success("Added new blank question.")}>
              <Plus className="h-4 w-4" /> Add Question
            </Button>
          </div>

          <div className="space-y-4">
            {exam.questions && exam.questions.length > 0 ? (
              exam.questions.map((q, idx) => (
                <Card key={q.id} className="shadow-card border-none">
                  <CardHeader className="pb-3 border-b border-muted/50 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm">Question {idx + 1}</CardTitle>
                    <div className="flex gap-2">
                      <Select defaultValue={q.difficulty}>
                        <SelectTrigger className="h-8 w-28 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="Easy">Easy</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Hard">Hard</SelectItem></SelectContent>
                      </Select>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <div className="space-y-2"><Label>Question Text</Label><Input defaultValue={q.text} /></div>
                    <div className="space-y-2">
                      <Label>Options & Correct Answer</Label>
                      <div className="space-y-2">
                        {q.options.map((opt, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <input type="radio" name={`correct-${q.id}`} defaultChecked={q.correctAnswer === opt} className="h-4 w-4 accent-primary" />
                            <Input defaultValue={opt} className={`flex-1 ${q.correctAnswer === opt ? "border-primary/50 bg-primary/5" : ""}`} />
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="mt-2 text-xs h-7"><Plus className="h-3 w-3 mr-1" /> Add Option</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="shadow-card border-none border-dashed bg-muted/20">
                 <CardContent className="p-12 text-center flex flex-col items-center">
                   <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                   <h3 className="font-semibold text-lg">No questions added yet</h3>
                   <p className="text-muted-foreground text-sm max-w-md mt-1 mb-4">
                     You set a target of {exam.totalQuestions} questions for this draft. Add them manually or return to the dashboard to generate them with AI.
                   </p>
                   <Button onClick={() => toast.success("Added new blank question.")} className="gradient-primary">Add First Question</Button>
                 </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
