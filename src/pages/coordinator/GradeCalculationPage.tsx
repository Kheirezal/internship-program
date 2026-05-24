import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/shared/StatusBadge";
import { mockGrades, mockEvaluations, mockRubricConfigs } from "@/data/mockData";
import { Calculator, Send, RefreshCw, CheckCircle2, Eye, AlertCircle, Scale } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Grade } from "@/types";

const DH_STATUS_LABELS: Record<string, string> = {
  pending_coordinator: "Pending Calculation",
  submitted_to_dh: "Submitted to DH",
  approved: "DH Approved",
  revision_requested: "Revision Requested",
  published: "Published",
};

const DH_STATUS_COLORS: Record<string, string> = {
  pending_coordinator: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  submitted_to_dh: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  revision_requested: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  published: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

export default function GradeCalculationPage() {
  const navigate = useNavigate();
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<Grade | null>(null);
  const [filter, setFilter] = useState("all");
  const rubric = mockRubricConfigs[0];

  const filtered = mockGrades.filter(g => filter === "all" || g.dhApprovalStatus === filter);
  const readyToSubmit = mockGrades.filter(g => g.dhApprovalStatus === "pending_coordinator" && g.supervisorScore > 0 && g.advisorScore > 0 && g.evaluatorScore > 0);

  const calculateGrade = (sup: number, adv: number, eva: number) => {
    return (sup * rubric.weights.supervisor + adv * rubric.weights.advisor + eva * rubric.weights.evaluator) / 100;
  };

  const getLetterGrade = (score: number) => {
    if (score >= 93) return "A";
    if (score >= 90) return "A-";
    if (score >= 87) return "B+";
    if (score >= 83) return "B";
    if (score >= 80) return "B-";
    if (score >= 77) return "C+";
    if (score >= 73) return "C";
    if (score >= 70) return "C-";
    if (score >= 67) return "D+";
    if (score >= 60) return "D";
    return "F";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Grade Calculation</h1>
          <p className="text-muted-foreground text-sm">Calculate final grades and submit to Department Head</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => navigate("/internship-coordinator/rubric")}
          >
            <Scale className="h-4 w-4" /> Rubric Config
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => toast.success(`${readyToSubmit.length} grades recalculated!`)}>
            <RefreshCw className="h-4 w-4" /> Recalculate All
          </Button>
          <Button className="gradient-primary gap-2" disabled={readyToSubmit.length === 0}
            onClick={() => toast.success(`${readyToSubmit.length} grades submitted to Department Head!`)}>
            <Send className="h-4 w-4" /> Submit to DH ({readyToSubmit.length})
          </Button>
        </div>
      </div>

      {/* Weight Formula */}
      <Card className="shadow-card border-none p-4">
        <div className="flex items-center gap-3 text-sm">
          <Calculator className="h-5 w-5 text-primary" />
          <span><strong>Active Formula:</strong> Supervisor ({rubric.weights.supervisor}%) + Advisor ({rubric.weights.advisor}%) + Evaluator ({rubric.weights.evaluator}%)</span>
        </div>
      </Card>

      <Select value={filter} onValueChange={setFilter}>
        <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Grades</SelectItem>
          <SelectItem value="pending_coordinator">Pending Calculation</SelectItem>
          <SelectItem value="submitted_to_dh">Submitted to DH</SelectItem>
          <SelectItem value="revision_requested">Revision Requested</SelectItem>
          <SelectItem value="approved">DH Approved</SelectItem>
          <SelectItem value="published">Published</SelectItem>
        </SelectContent>
      </Select>

      <Card className="shadow-card border-none">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-muted-foreground">
                <th className="p-4 font-medium">Student</th>
                <th className="p-4 font-medium">Sup ({rubric.weights.supervisor}%)</th>
                <th className="p-4 font-medium">Adv ({rubric.weights.advisor}%)</th>
                <th className="p-4 font-medium">Eva ({rubric.weights.evaluator}%)</th>
                <th className="p-4 font-medium">Calculated</th>
                <th className="p-4 font-medium">Letter</th>
                <th className="p-4 font-medium">Workflow</th>
                <th className="p-4 font-medium">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map(g => {
                  const allScored = g.supervisorScore > 0 && g.advisorScore > 0 && g.evaluatorScore > 0;
                  const calc = allScored ? calculateGrade(g.supervisorScore, g.advisorScore, g.evaluatorScore) : 0;
                  const letter = allScored ? getLetterGrade(calc) : "—";
                  const missingEvals = [];
                  if (!g.supervisorScore) missingEvals.push("Supervisor");
                  if (!g.advisorScore) missingEvals.push("Advisor");
                  if (!g.evaluatorScore) missingEvals.push("Evaluator");

                  return (
                    <tr key={g.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium">{g.studentName}</td>
                      <td className="p-4 font-mono">{g.supervisorScore || <span className="text-rose-500 text-xs flex items-center gap-1"><AlertCircle className="h-3 w-3" />Missing</span>}</td>
                      <td className="p-4 font-mono">{g.advisorScore || <span className="text-rose-500 text-xs flex items-center gap-1"><AlertCircle className="h-3 w-3" />Missing</span>}</td>
                      <td className="p-4 font-mono">{g.evaluatorScore || <span className="text-rose-500 text-xs flex items-center gap-1"><AlertCircle className="h-3 w-3" />Missing</span>}</td>
                      <td className="p-4 font-mono font-bold">{allScored ? calc.toFixed(1) : "—"}</td>
                      <td className="p-4 font-bold text-primary">{letter}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${DH_STATUS_COLORS[g.dhApprovalStatus]}`}>
                          {DH_STATUS_LABELS[g.dhApprovalStatus]}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setSelected(g); setViewOpen(true); }}><Eye className="h-4 w-4" /></Button>
                          {g.dhApprovalStatus === "pending_coordinator" && allScored && (
                            <Button size="sm" className="h-8 text-xs gradient-primary gap-1" onClick={() => toast.success(`Grade submitted to DH for ${g.studentName}`)}>
                              <Send className="h-3 w-3" /> Submit
                            </Button>
                          )}
                          {g.dhApprovalStatus === "revision_requested" && (
                            <Button size="sm" variant="outline" className="h-8 text-xs gap-1" onClick={() => toast.success("Grade resubmitted to DH")}>
                              <RefreshCw className="h-3 w-3" /> Resubmit
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Grade Details — {selected?.studentName}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              {[
                { label: `Supervisor (${rubric.weights.supervisor}%)`, score: selected.supervisorScore },
                { label: `Advisor (${rubric.weights.advisor}%)`, score: selected.advisorScore },
                { label: `Evaluator (${rubric.weights.evaluator}%)`, score: selected.evaluatorScore },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span>{s.label}</span>
                  <span className="font-mono font-bold">{s.score || "—"}</span>
                </div>
              ))}
              <div className="flex items-center justify-between p-4 rounded-lg border-2 border-primary/30">
                <span className="font-bold">Calculated Final</span>
                <span className="text-2xl font-bold text-primary">
                  {selected.supervisorScore && selected.advisorScore && selected.evaluatorScore
                    ? calculateGrade(selected.supervisorScore, selected.advisorScore, selected.evaluatorScore).toFixed(1)
                    : "—"
                  }
                </span>
              </div>
              {selected.dhComments && (
                <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-200 dark:border-rose-800">
                  <p className="text-muted-foreground text-xs mb-1">DH Revision Comments</p>
                  <p>{selected.dhComments}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground text-xs mb-2">Related Evaluations</p>
                <div className="space-y-2">
                  {mockEvaluations.filter(e => e.placementId === selected.placementId).map(e => (
                    <div key={e.id} className="flex items-center justify-between p-2 rounded border text-xs">
                      <span>{e.evaluatorName} ({e.evaluatorRole})</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{e.score}/100</span>
                        <StatusBadge status={e.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
