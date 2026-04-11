import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/shared/StatusBadge";
import { mockComplaints } from "@/data/mockData";
import { Plus, Eye, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Complaint } from "@/types";
import { useAuthStore } from "@/stores/authStore";

export default function ComplaintsPage() {
  const { user } = useAuthStore();
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [respondOpen, setRespondOpen] = useState(false);
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const isStudent = user?.role === "internship_student";
  const filtered = mockComplaints.filter(c => statusFilter === "all" || c.status === statusFilter);

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Complaints</h1><p className="text-muted-foreground text-sm">Grade complaints and resolutions</p></div>
        {isStudent && (
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild><Button className="gradient-primary gap-2"><Plus className="h-4 w-4" /> New Complaint</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Submit Grade Complaint</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2"><Label>Subject</Label><Input placeholder="Brief description of the complaint" /></div>
                <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Provide detailed explanation of your complaint..." rows={5} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button className="gradient-primary" onClick={() => { setCreateOpen(false); toast.success("Complaint submitted!"); }}>Submit</Button>
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
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_review">In Review</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-muted-foreground">
                <th className="p-4 font-medium">Student</th><th className="p-4 font-medium">Subject</th><th className="p-4 font-medium">Date</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium">{c.studentName}</td>
                    <td className="p-4">{c.subject}</td>
                    <td className="p-4">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="p-4"><StatusBadge status={c.status} /></td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setSelected(c); setViewOpen(true); }}><Eye className="h-4 w-4" /></Button>
                        {!isStudent && c.status !== "resolved" && c.status !== "closed" && (
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setSelected(c); setRespondOpen(true); }}><MessageSquare className="h-4 w-4" /></Button>
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
          <DialogHeader><DialogTitle>Complaint Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground">Student</p><p className="font-medium">{selected.studentName}</p></div>
                <div><p className="text-muted-foreground">Status</p><StatusBadge status={selected.status} /></div>
                <div><p className="text-muted-foreground">Submitted</p><p className="font-medium">{new Date(selected.createdAt).toLocaleString()}</p></div>
                {selected.resolvedAt && <div><p className="text-muted-foreground">Resolved</p><p className="font-medium">{new Date(selected.resolvedAt).toLocaleString()}</p></div>}
              </div>
              <div><p className="text-muted-foreground mb-1">Subject</p><p className="font-medium">{selected.subject}</p></div>
              <div><p className="text-muted-foreground mb-1">Description</p><p className="p-3 rounded-lg bg-muted/50">{selected.description}</p></div>
              {selected.response && <div><p className="text-muted-foreground mb-1">Response</p><p className="p-3 rounded-lg bg-accent/30">{selected.response}</p></div>}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Respond Dialog */}
      <Dialog open={respondOpen} onOpenChange={setRespondOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Respond to Complaint</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground"><strong>{selected?.studentName}:</strong> {selected?.subject}</p>
            <div className="space-y-2"><Label>Response</Label><Textarea placeholder="Your response to this complaint..." rows={4} /></div>
            <div className="space-y-2">
              <Label>Update Status</Label>
              <Select defaultValue="in_review">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRespondOpen(false)}>Cancel</Button>
            <Button className="gradient-primary" onClick={() => { setRespondOpen(false); toast.success("Response sent!"); }}>Submit Response</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
