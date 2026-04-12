import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/shared/StatusBadge";
import { mockEvaluations, mockPlacements } from "@/data/mockData";
import { Plus, Eye, Edit } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Evaluation } from "@/types";
import { Slider } from "@/components/ui/slider";
import { useAuthStore } from "@/stores/authStore";

export default function EvaluationsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<Evaluation | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const { user } = useAuthStore();
  const canEvaluate = user?.role === "internship_advisor" || user?.role === "company_supervisor";

  const filtered = mockEvaluations.filter(e => statusFilter === "all" || e.status === statusFilter);

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Evaluations</h1><p className="text-muted-foreground text-sm">Manage internship evaluations</p></div>
        {canEvaluate && (
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild><Button className="gradient-primary gap-2"><Plus className="h-4 w-4" /> New Evaluation</Button></DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Create Evaluation</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Student / Placement</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select placement" /></SelectTrigger>
                    <SelectContent>{mockPlacements.filter(p => p.status === "active").map(p => <SelectItem key={p.id} value={p.id}>{p.studentName} — {p.companyName}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Evaluator role" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="supervisor">Company Supervisor (30%)</SelectItem>
                      <SelectItem value="advisor">Academic Advisor (30%)</SelectItem>
                      <SelectItem value="evaluator">Academic Evaluator (40%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label>Criteria Scores</Label>
                  {["Technical Skills", "Communication", "Teamwork", "Problem Solving", "Initiative"].map(c => (
                    <div key={c} className="space-y-1">
                      <div className="flex justify-between text-sm"><span>{c}</span><span className="text-muted-foreground">0/100</span></div>
                      <Slider defaultValue={[75]} max={100} step={1} className="w-full" />
                    </div>
                  ))}
                </div>
                <div className="space-y-2"><Label>Comments</Label><Textarea placeholder="Evaluation comments..." rows={3} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button className="gradient-primary" onClick={() => { setCreateOpen(false); toast.success("Evaluation created!"); }}>Submit Evaluation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="finalized">Finalized</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-muted-foreground">
                <th className="p-4 font-medium">Student</th><th className="p-4 font-medium">Evaluator</th><th className="p-4 font-medium">Role</th><th className="p-4 font-medium">Score</th><th className="p-4 font-medium">Weight</th><th className="p-4 font-medium">Date</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium">{e.studentName}</td>
                    <td className="p-4">{e.evaluatorName}</td>
                    <td className="p-4 capitalize">{e.evaluatorRole}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-12 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${e.score}%` }} /></div>
                        <span className="font-mono">{e.score}</span>
                      </div>
                    </td>
                    <td className="p-4">{e.weight}%</td>
                    <td className="p-4">{e.date}</td>
                    <td className="p-4"><StatusBadge status={e.status} /></td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setSelected(e); setViewOpen(true); }}><Eye className="h-4 w-4" /></Button>
                        {canEvaluate && e.status !== "finalized" && <Button size="icon" variant="ghost" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Evaluation Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground">Student</p><p className="font-medium">{selected.studentName}</p></div>
                <div><p className="text-muted-foreground">Evaluator</p><p className="font-medium">{selected.evaluatorName}</p></div>
                <div><p className="text-muted-foreground">Role</p><p className="font-medium capitalize">{selected.evaluatorRole}</p></div>
                <div><p className="text-muted-foreground">Weight</p><p className="font-medium">{selected.weight}%</p></div>
                <div><p className="text-muted-foreground">Overall Score</p><p className="font-bold text-lg">{selected.score}/100</p></div>
                <div><p className="text-muted-foreground">Status</p><StatusBadge status={selected.status} /></div>
              </div>
              <div>
                <p className="text-muted-foreground mb-2">Criteria Breakdown</p>
                <div className="space-y-2">
                  {selected.criteria.map(c => (
                    <div key={c.name} className="flex items-center justify-between">
                      <span>{c.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${(c.score / c.maxScore) * 100}%` }} /></div>
                        <span className="font-mono text-xs">{c.score}/{c.maxScore}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div><p className="text-muted-foreground mb-1">Comments</p><p className="p-3 rounded-lg bg-muted/50">{selected.comments}</p></div>
              {canEvaluate && selected.status === "submitted" && (
                <Button className="w-full gradient-primary" onClick={() => { setViewOpen(false); toast.success("Evaluation finalized!"); }}>Finalize Evaluation</Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
