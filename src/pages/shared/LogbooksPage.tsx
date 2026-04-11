import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/shared/StatusBadge";
import { mockLogbooks } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Search, CheckCircle, XCircle, Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import type { Logbook } from "@/types";

export default function LogbooksPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewOpen, setViewOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [selected, setSelected] = useState<Logbook | null>(null);
  const [feedback, setFeedback] = useState("");
  const [action, setAction] = useState<"approve" | "reject">("approve");

  const filtered = mockLogbooks
    .filter(l => l.studentName.toLowerCase().includes(search.toLowerCase()) || l.title.toLowerCase().includes(search.toLowerCase()))
    .filter(l => statusFilter === "all" || l.status === statusFilter);

  const handleReview = () => {
    toast.success(action === "approve" ? "Logbook approved!" : "Logbook rejected!");
    setFeedbackOpen(false);
    setFeedback("");
  };

  return (
    <div className="space-y-6 animate-in">
      <div><h1 className="text-2xl font-bold">Logbooks</h1><p className="text-muted-foreground text-sm">Review student logbook entries</p></div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search logbooks..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-muted-foreground">
                <th className="p-4 font-medium">Student</th><th className="p-4 font-medium">Title</th><th className="p-4 font-medium">Date</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium">{l.studentName}</td>
                    <td className="p-4">{l.title}</td>
                    <td className="p-4">{l.date}</td>
                    <td className="p-4"><StatusBadge status={l.status} /></td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setSelected(l); setViewOpen(true); }}><Eye className="h-4 w-4" /></Button>
                        {l.status === "submitted" && (
                          <>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-success" onClick={() => { setSelected(l); setAction("approve"); setFeedbackOpen(true); }}><CheckCircle className="h-4 w-4" /></Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => { setSelected(l); setAction("reject"); setFeedbackOpen(true); }}><XCircle className="h-4 w-4" /></Button>
                          </>
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
        <DialogContent>
          <DialogHeader><DialogTitle>{selected?.title}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground">Student</p><p className="font-medium">{selected.studentName}</p></div>
                <div><p className="text-muted-foreground">Date</p><p className="font-medium">{selected.date}</p></div>
                <div><p className="text-muted-foreground">Status</p><StatusBadge status={selected.status} /></div>
                {selected.reviewedBy && <div><p className="text-muted-foreground">Reviewed By</p><p className="font-medium">{selected.reviewedBy}</p></div>}
              </div>
              <div><p className="text-muted-foreground mb-1">Content</p><p className="p-3 rounded-lg bg-muted/50">{selected.content}</p></div>
              {selected.feedback && <div><p className="text-muted-foreground mb-1">Feedback</p><p className="p-3 rounded-lg bg-accent/30">{selected.feedback}</p></div>}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{action === "approve" ? "Approve" : "Reject"} Logbook</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{action === "approve" ? "Approve" : "Reject"} logbook entry: <strong>{selected?.title}</strong></p>
            <div className="space-y-2"><Label>Feedback</Label><Textarea value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Provide feedback to the student..." rows={4} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackOpen(false)}>Cancel</Button>
            <Button variant={action === "approve" ? "default" : "destructive"} onClick={handleReview}>{action === "approve" ? "Approve" : "Reject"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
