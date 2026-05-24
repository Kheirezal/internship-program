import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { mockRubricConfigs } from "@/data/mockData";
import { Settings, Plus, Trash2, Save, Scale, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";

export default function RubricConfigPage() {
  const navigate = useNavigate();
  const rubric = mockRubricConfigs[0];
  const [editOpen, setEditOpen] = useState(false);
  const [weights, setWeights] = useState(rubric.weights);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 -ml-2 text-muted-foreground"
        onClick={() => navigate("/internship-coordinator/grades")}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Grade Calculation
      </Button>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Evaluation Rubric</h1>
          <p className="text-muted-foreground text-sm">Configure grading criteria and evaluation weights</p>
        </div>
        <Button className="gradient-primary gap-2" onClick={() => setEditOpen(true)}>
          <Settings className="h-4 w-4" /> Edit Weights
        </Button>
      </div>

      {/* Active Rubric */}
      <Card className="shadow-card border-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2"><Scale className="h-4 w-4 text-primary" />{rubric.name}</CardTitle>
              <CardDescription>Last updated: {rubric.updatedAt}</CardDescription>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold dark:bg-emerald-900/30 dark:text-emerald-400">ACTIVE</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Weight Distribution */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Grade Weight Distribution</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Company Supervisor", value: weights.supervisor, color: "bg-blue-500" },
                { label: "Academic Advisor", value: weights.advisor, color: "bg-emerald-500" },
                { label: "Academic Evaluator", value: weights.evaluator, color: "bg-violet-500" },
              ].map(w => (
                <div key={w.label} className="text-center p-4 rounded-xl border bg-card">
                  <div className={`h-16 w-16 rounded-full ${w.color} text-white flex items-center justify-center text-xl font-bold mx-auto mb-2`}>
                    {w.value}%
                  </div>
                  <p className="text-sm font-medium">{w.label}</p>
                </div>
              ))}
            </div>
            <div className="h-4 rounded-full overflow-hidden flex">
              <div className="bg-blue-500 transition-all" style={{ width: `${weights.supervisor}%` }} />
              <div className="bg-emerald-500 transition-all" style={{ width: `${weights.advisor}%` }} />
              <div className="bg-violet-500 transition-all" style={{ width: `${weights.evaluator}%` }} />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Total: {weights.supervisor + weights.advisor + weights.evaluator}% (must equal 100%)
            </p>
          </div>

          {/* Criteria */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Evaluation Criteria ({rubric.criteria.length})</h3>
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => toast.success("Criterion added!")}>
                <Plus className="h-3 w-3" /> Add Criterion
              </Button>
            </div>
            <div className="space-y-3">
              {rubric.criteria.map((c, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-xl border hover:bg-muted/30 transition-colors">
                  <div className="h-8 w-8 rounded-lg gradient-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">{idx + 1}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">{c.name}</h4>
                      <span className="text-xs text-muted-foreground font-mono">Max: {c.maxScore}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{c.description}</p>
                  </div>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive/50 hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card p-4 border-none">
        <p className="text-sm text-muted-foreground"><strong>Formula:</strong> Final Grade = (Supervisor Score × {weights.supervisor}%) + (Advisor Score × {weights.advisor}%) + (Evaluator Score × {weights.evaluator}%)</p>
      </Card>

      {/* Edit Weights Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Configure Grade Weights</DialogTitle></DialogHeader>
          <div className="space-y-6">
            {[
              { label: "Company Supervisor", key: "supervisor" as const, color: "text-blue-500" },
              { label: "Academic Advisor", key: "advisor" as const, color: "text-emerald-500" },
              { label: "Academic Evaluator", key: "evaluator" as const, color: "text-violet-500" },
            ].map(w => (
              <div key={w.key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className={w.color}>{w.label}</Label>
                  <span className="font-mono font-bold">{weights[w.key]}%</span>
                </div>
                <Slider
                  value={[weights[w.key]]}
                  onValueChange={(v) => setWeights(prev => ({ ...prev, [w.key]: v[0] }))}
                  max={100}
                  step={5}
                />
              </div>
            ))}
            <div className={`p-3 rounded-lg text-center font-bold ${weights.supervisor + weights.advisor + weights.evaluator === 100 ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`}>
              Total: {weights.supervisor + weights.advisor + weights.evaluator}%
              {weights.supervisor + weights.advisor + weights.evaluator !== 100 && " (must be 100%)"}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button
              className="gradient-primary"
              disabled={weights.supervisor + weights.advisor + weights.evaluator !== 100}
              onClick={() => { setEditOpen(false); toast.success("Weights updated!"); }}
            >
              <Save className="h-4 w-4 mr-2" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
