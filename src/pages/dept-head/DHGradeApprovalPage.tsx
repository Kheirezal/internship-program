import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import StatusBadge from "@/components/shared/StatusBadge";
import { mockGrades, mockEvaluations } from "@/data/mockData";
import { CheckCircle2, XCircle, RotateCcw, Eye, Send, ShieldCheck, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Grade } from "@/types";

const DH_STATUS_COLORS: Record<string, string> = {
  pending_coordinator: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  submitted_to_dh: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  revision_requested: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  published: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

const DH_STATUS_LABELS: Record<string, string> = {
  pending_coordinator: "Pending Coordinator",
  submitted_to_dh: "Awaiting DH Review",
  approved: "Approved by DH",
  revision_requested: "Revision Requested",
  published: "Published",
};

export default function DHGradeApprovalPage() {
  const [viewOpen, setViewOpen] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const [selected, setSelected] = useState<Grade | null>(null);
  const [filter, setFilter] = useState("all");
  const [dhComment, setDhComment] = useState("");
  const [actionType, setActionType] = useState<"approve" | "revise" | "publish">("approve");

  const filtered = mockGrades.filter(g => filter === "all" || g.dhApprovalStatus === filter);

  const pendingCount = mockGrades.filter(g => g.dhApprovalStatus === "submitted_to_dh").length;
  const approvedCount = mockGrades.filter(g => g.dhApprovalStatus === "approved").length;
  const publishedCount = mockGrades.filter(g => g.dhApprovalStatus === "published").length;

  const handleAction = () => {
    if (actionType === "approve") {
      toast.success(`Grade for ${selected?.studentName} approved!`);
    } else if (actionType === "revise") {
      toast.warning(`Revision requested for ${selected?.studentName}`);
    } else {
      toast.success(`Grade for ${selected?.studentName} published officially!`);
    }
    setActionOpen(false);
    setDhComment("");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Grade Approval</h1>
          <p className="text-muted-foreground text-sm">Review, approve, and publish final grades</p>
        </div>
        <Button
          className="gradient-primary gap-2"
          onClick={() => toast.success("All approved grades published!")}
          disabled={approvedCount === 0}
        >
          <Send className="h-4 w-4" /> Publish All Approved ({approvedCount})
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Awaiting Review", value: pendingCount, icon: AlertTriangle, color: "text-amber-500" },
          { label: "Approved", value: approvedCount, icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Revision Requested", value: mockGrades.filter(g => g.dhApprovalStatus === "revision_requested").length, icon: RotateCcw, color: "text-rose-500" },
          { label: "Published", value: publishedCount, icon: ShieldCheck, color: "text-blue-500" },
        ].map(s => (
          <Card key={s.label} className="shadow-card border-none">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted ${s.color}`}><s.icon className="h-5 w-5" /></div>
              <div><p className="text-xs text-muted-foreground">{s.label}</p><p className="text-xl font-bold">{s.value}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <Select value={filter} onValueChange={setFilter}>
        <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Grades</SelectItem>
          <SelectItem value="submitted_to_dh">Awaiting My Review</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="revision_requested">Revision Requested</SelectItem>
          <SelectItem value="published">Published</SelectItem>
        </SelectContent>
      </Select>

      {/* Grades Table */}
      <Card className="shadow-card border-none">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-muted-foreground">
                <th className="p-4 font-medium">Student</th>
                <th className="p-4 font-medium">Supervisor (30%)</th>
                <th className="p-4 font-medium">Advisor (30%)</th>
                <th className="p-4 font-medium">Evaluator (40%)</th>
                <th className="p-4 font-medium">Final</th>
                <th className="p-4 font-medium">Letter</th>
                <th className="p-4 font-medium">DH Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map((g) => (
                  <tr key={g.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium">{g.studentName}</td>
                    <td className="p-4 font-mono">{g.supervisorScore || "—"}</td>
                    <td className="p-4 font-mono">{g.advisorScore || "—"}</td>
                    <td className="p-4 font-mono">{g.evaluatorScore || "—"}</td>
                    <td className="p-4 font-mono font-bold">{g.finalGrade || "—"}</td>
                    <td className="p-4 font-bold text-primary">{g.letterGrade}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${DH_STATUS_COLORS[g.dhApprovalStatus]}`}>
                        {DH_STATUS_LABELS[g.dhApprovalStatus]}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setSelected(g); setViewOpen(true); }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {g.dhApprovalStatus === "submitted_to_dh" && (
                          <>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-600 hover:text-emerald-700" onClick={() => { setSelected(g); setActionType("approve"); setActionOpen(true); }}>
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-rose-600 hover:text-rose-700" onClick={() => { setSelected(g); setActionType("revise"); setActionOpen(true); }}>
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {g.dhApprovalStatus === "approved" && (
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:text-blue-700" onClick={() => { setSelected(g); setActionType("publish"); setActionOpen(true); }}>
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
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
          <DialogHeader><DialogTitle>Grade Details — {selected?.studentName}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="space-y-3">
                {[
                  { label: "Company Supervisor (30%)", score: selected.supervisorScore },
                  { label: "Academic Advisor (30%)", score: selected.advisorScore },
                  { label: "Academic Evaluator (40%)", score: selected.evaluatorScore },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span>{s.label}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${s.score}%` }} /></div>
                      <span className="font-mono font-bold">{s.score || "—"}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border-2 border-primary/30">
                <span className="font-bold">Final Grade</span>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{selected.letterGrade}</p>
                  <p className="text-sm text-muted-foreground">{selected.finalGrade}/100</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span>DH Approval Status</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${DH_STATUS_COLORS[selected.dhApprovalStatus]}`}>
                  {DH_STATUS_LABELS[selected.dhApprovalStatus]}
                </span>
              </div>
              {selected.dhComments && (
                <div><p className="text-muted-foreground mb-1">DH Comments</p><p className="p-3 rounded-lg bg-muted/50">{selected.dhComments}</p></div>
              )}
              {selected.submittedToDhAt && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Submitted to DH</span><span>{selected.submittedToDhAt}</span>
                </div>
              )}
              {selected.publishedAt && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Published</span><span>{selected.publishedAt}</span>
                </div>
              )}
              {/* Related Evaluations */}
              <div>
                <p className="text-muted-foreground mb-2">Related Evaluations</p>
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

      {/* Action Dialog */}
      <Dialog open={actionOpen} onOpenChange={setActionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" && "Approve Grade"}
              {actionType === "revise" && "Request Revision"}
              {actionType === "publish" && "Publish Grade"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-muted/50 text-sm">
              <p><strong>Student:</strong> {selected?.studentName}</p>
              <p><strong>Final Grade:</strong> {selected?.letterGrade} ({selected?.finalGrade}/100)</p>
            </div>
            <div className="space-y-2">
              <Label>{actionType === "revise" ? "Revision Reason (Required)" : "Comments (Optional)"}</Label>
              <Textarea
                value={dhComment}
                onChange={(e) => setDhComment(e.target.value)}
                placeholder={actionType === "revise" ? "Explain what needs to be revised..." : "Add any comments..."}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionOpen(false)}>Cancel</Button>
            <Button
              className={actionType === "revise" ? "bg-rose-600 hover:bg-rose-700 text-white" : "gradient-primary"}
              onClick={handleAction}
              disabled={actionType === "revise" && !dhComment.trim()}
            >
              {actionType === "approve" && <><CheckCircle2 className="h-4 w-4 mr-2" /> Approve</>}
              {actionType === "revise" && <><RotateCcw className="h-4 w-4 mr-2" /> Request Revision</>}
              {actionType === "publish" && <><Send className="h-4 w-4 mr-2" /> Publish Officially</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="shadow-card p-4 border-none">
        <p className="text-sm text-muted-foreground"><strong>Workflow:</strong> Coordinator calculates grade → Submits to DH → DH approves/requests revision → DH publishes officially</p>
      </Card>
    </div>
  );
}
