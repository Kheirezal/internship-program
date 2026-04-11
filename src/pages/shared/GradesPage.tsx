import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/shared/StatusBadge";
import { mockGrades, mockEvaluations } from "@/data/mockData";
import { Eye, Download, BarChart3 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Grade } from "@/types";
import { useAuthStore } from "@/stores/authStore";

export default function GradesPage() {
  const { user } = useAuthStore();
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<Grade | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const isCoordinator = user?.role === "internship_coordinator";
  const filtered = mockGrades.filter(g => statusFilter === "all" || g.status === statusFilter);

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Grades</h1><p className="text-muted-foreground text-sm">Internship grades overview</p></div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => toast.success("Grades exported!")}><Download className="h-4 w-4" /> Export</Button>
          {isCoordinator && <Button className="gradient-primary gap-2" onClick={() => toast.success("All grades published!")}><BarChart3 className="h-4 w-4" /> Publish All</Button>}
        </div>
      </div>

      <div className="flex gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-muted-foreground">
                <th className="p-4 font-medium">Student</th>
                <th className="p-4 font-medium">Supervisor (30%)</th>
                <th className="p-4 font-medium">Advisor (30%)</th>
                <th className="p-4 font-medium">Evaluator (40%)</th>
                <th className="p-4 font-medium">Final</th>
                <th className="p-4 font-medium">Grade</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map((g) => (
                  <tr key={g.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="p-4 font-medium">{g.studentName}</td>
                    <td className="p-4 font-mono">{g.supervisorScore || "-"}</td>
                    <td className="p-4 font-mono">{g.advisorScore || "-"}</td>
                    <td className="p-4 font-mono">{g.evaluatorScore || "-"}</td>
                    <td className="p-4 font-mono font-bold">{g.finalGrade || "-"}</td>
                    <td className="p-4 font-bold text-primary">{g.letterGrade}</td>
                    <td className="p-4"><StatusBadge status={g.status} /></td>
                    <td className="p-4">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setSelected(g); setViewOpen(true); }}><Eye className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card p-4">
        <p className="text-sm text-muted-foreground"><strong>Grade Formula:</strong> Company Supervisor (30%) + Academic Advisor (30%) + Academic Evaluator (40%)</p>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Grade Breakdown – {selected?.studentName}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span>Company Supervisor (30%)</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${selected.supervisorScore}%` }} /></div>
                    <span className="font-mono font-bold">{selected.supervisorScore || "-"}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span>Academic Advisor (30%)</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${selected.advisorScore}%` }} /></div>
                    <span className="font-mono font-bold">{selected.advisorScore || "-"}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span>Academic Evaluator (40%)</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${selected.evaluatorScore}%` }} /></div>
                    <span className="font-mono font-bold">{selected.evaluatorScore || "-"}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border-2 border-primary/30">
                <span className="font-bold">Final Grade</span>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{selected.letterGrade}</p>
                  <p className="text-sm text-muted-foreground">{selected.finalGrade}/100</p>
                </div>
              </div>
              <StatusBadge status={selected.status} />

              {/* Related Evaluations */}
              <div>
                <p className="text-muted-foreground mb-2">Related Evaluations</p>
                <div className="space-y-2">
                  {mockEvaluations.filter(e => e.placementId === selected.placementId).map(e => (
                    <div key={e.id} className="flex items-center justify-between p-2 rounded border text-xs">
                      <span>{e.evaluatorName} ({e.evaluatorRole})</span>
                      <span className="font-mono">{e.score}/100</span>
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
