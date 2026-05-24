import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/shared/StatusBadge";
import { mockApplications } from "@/data/mockData";
import { Plus, Send, Eye, Building2, Briefcase, Clock, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { InternshipApplication } from "@/types";
import { useAuthStore } from "@/stores/authStore";

export default function InternshipApplicationPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<InternshipApplication | null>(null);
  const [isSelfFound, setIsSelfFound] = useState(true);

  const isStudent = user?.role === "internship_student";
  const isCoordinator = user?.role === "internship_coordinator";

  const applications = isStudent
    ? mockApplications.filter(a => a.studentId === user?.id || a.studentId === "u5")
    : mockApplications;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {isCoordinator && (
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 -ml-2 text-muted-foreground"
          onClick={() => navigate("/internship-coordinator/students")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Students
        </Button>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{isStudent ? "My Internship Application" : "Internship Applications"}</h1>
          <p className="text-muted-foreground text-sm">
            {isStudent ? "Submit your internship placement request" : "Review and approve student applications"}
          </p>
        </div>
        {isStudent && (
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary gap-2"><Plus className="h-4 w-4" /> New Application</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Internship Application</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Application Type</Label>
                  <Select defaultValue="self_found" onValueChange={(v) => setIsSelfFound(v === "self_found")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="self_found">Self-Found Company</SelectItem>
                      <SelectItem value="request_placement">Request University Placement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {isSelfFound ? (
                  <>
                    <div className="space-y-2"><Label>Company Name</Label><Input placeholder="Enter the company name" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Contact Person</Label><Input placeholder="Name" /></div>
                      <div className="space-y-2"><Label>Contact Email</Label><Input type="email" placeholder="Email" /></div>
                    </div>
                    <div className="space-y-2"><Label>Company Address</Label><Input placeholder="Full address" /></div>
                  </>
                ) : (
                  <div className="p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-2">University Placement Request</p>
                    <p>The coordinator will assign you to a suitable partner company based on your skills and available positions.</p>
                  </div>
                )}
                <div className="space-y-2"><Label>Proposed Role / Position</Label><Input placeholder="e.g. Backend Developer Intern" /></div>
                <div className="space-y-2"><Label>Additional Notes</Label><Textarea placeholder="Any additional information..." rows={3} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Save as Draft</Button>
                <Button className="gradient-primary" onClick={() => { setCreateOpen(false); toast.success("Application submitted!"); }}>
                  <Send className="h-4 w-4 mr-2" /> Submit Application
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Applications List */}
      <Card className="shadow-card border-none">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-muted-foreground">
                {!isStudent && <th className="p-4 font-medium">Student</th>}
                <th className="p-4 font-medium">Company</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Submitted</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr></thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    {!isStudent && <td className="p-4 font-medium">{app.studentName}</td>}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {app.companyName || <span className="text-muted-foreground italic">Requesting placement</span>}
                      </div>
                    </td>
                    <td className="p-4">{app.proposedRole}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${app.isSelfFound ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"}`}>
                        {app.isSelfFound ? "Self-Found" : "University"}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{app.submittedAt}</td>
                    <td className="p-4"><StatusBadge status={app.status} /></td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setSelected(app); setViewOpen(true); }}><Eye className="h-4 w-4" /></Button>
                        {isCoordinator && app.status === "under_review" && (
                          <>
                            <Button size="sm" className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => toast.success(`Application approved for ${app.studentName}`)}>Approve</Button>
                            <Button size="sm" variant="outline" className="h-8 text-xs text-destructive" onClick={() => toast.success(`Application rejected`)}>Reject</Button>
                          </>
                        )}
                        {isCoordinator && app.status === "submitted" && (
                          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => toast.success("Moved to review")}>Start Review</Button>
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
          <DialogHeader><DialogTitle>Application Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground text-xs">Student</p><p className="font-medium">{selected.studentName}</p></div>
                <div><p className="text-muted-foreground text-xs">Type</p><p className="font-medium">{selected.isSelfFound ? "Self-Found" : "University Placement"}</p></div>
                <div><p className="text-muted-foreground text-xs">Proposed Role</p><p className="font-medium">{selected.proposedRole}</p></div>
                <div><p className="text-muted-foreground text-xs">Status</p><StatusBadge status={selected.status} /></div>
              </div>
              {selected.isSelfFound && (
                <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                  <p className="font-medium flex items-center gap-1.5"><Building2 className="h-4 w-4" /> Company Details</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-muted-foreground">Company:</span> {selected.companyName}</div>
                    <div><span className="text-muted-foreground">Contact:</span> {selected.companyContact}</div>
                    <div><span className="text-muted-foreground">Email:</span> {selected.companyEmail}</div>
                    <div><span className="text-muted-foreground">Address:</span> {selected.companyAddress}</div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Submitted: {selected.submittedAt}</div>
                {selected.reviewedAt && <div className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Reviewed: {selected.reviewedAt}</div>}
              </div>
              {selected.coordinatorNotes && (
                <div><p className="text-muted-foreground text-xs mb-1">Coordinator Notes</p><p className="p-3 rounded-lg bg-muted/50">{selected.coordinatorNotes}</p></div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
