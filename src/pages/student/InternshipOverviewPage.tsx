import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { mockActivities, mockPlacements } from "@/data/mockData";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase, Building2, User, Calendar, CheckCircle2, Search, FileCode2, Send, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const placement = mockPlacements[2]; // Using the pending_student_confirmation mock

const TIMELINE_ICONS: Record<string, React.ElementType> = {
  logbook_submitted: Calendar,
  attendance_recorded: CheckCircle2,
  task_assigned: Briefcase,
  logbook_approved: CheckCircle2,
  evaluation_submitted: User,
};

export default function InternshipOverviewPage() {
  const [placementStatus, setPlacementStatus] = useState(placement.status);
  const [projectTitle, setProjectTitle] = useState(placement.projectTitle || "");
  const [proposing, setProposing] = useState(false);

  const handleConfirmPlacement = () => {
    toast.success("Placement Confirmed! Your internship has officially started.");
    setPlacementStatus("active");
  };

  const handleProposeProject = () => {
    toast.success("Project title submitted to your Company Supervisor for approval.");
    setProposing(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div>
           <h1 className="text-2xl font-bold">My Internship Hub</h1>
           <p className="text-muted-foreground text-sm">Manage your placement, project definition, and timeline</p>
         </div>
         <div className="flex gap-2">
           <Dialog>
             <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5 text-primary">
                  <Search className="h-4 w-4" /> Propose Self-Placement
                </Button>
             </DialogTrigger>
             <DialogContent>
                <DialogHeader><DialogTitle>Register Independent Placement</DialogTitle></DialogHeader>
                <div className="space-y-4 py-2">
                   <p className="text-xs text-muted-foreground">Found your own internship? Submit the company details here for Coordinator approval.</p>
                   <div className="space-y-2"><Label>Company Name</Label><Input placeholder="e.g. Acme Corp" /></div>
                   <div className="space-y-2"><Label>Supervisor Email</Label><Input type="email" placeholder="supervisor@acme.com" /></div>
                   <div className="space-y-2"><Label>Target Position</Label><Input placeholder="Frontend Intern" /></div>
                   <Button className="w-full gradient-primary gap-2" onClick={() => toast.success("Self-placement sent for verification.")}><Send className="h-4 w-4" /> Submit Proposal</Button>
                </div>
             </DialogContent>
           </Dialog>
         </div>
      </div>

      {placementStatus === "pending_student_confirmation" && (
        <Card className="border-amber-500/50 bg-amber-500/5 shadow-md">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="font-bold text-amber-700 flex items-center gap-2"><Building2 className="h-5 w-5" /> Placement Offer Received!</h3>
              <p className="text-sm text-amber-700/80">The Coordinator has matched you with <strong>{placement.companyName}</strong>. Please confirm your acceptance to start your internship process.</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button variant="outline" className="flex-1 md:flex-initial text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => toast.error("Placement rejected. Coordinator notified.")}><XCircle className="h-4 w-4 mr-2" /> Reject</Button>
              <Button className="flex-1 md:flex-initial bg-amber-500 hover:bg-amber-600 text-white" onClick={handleConfirmPlacement}><CheckCircle2 className="h-4 w-4 mr-2" /> Confirm Acceptance</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="shadow-card border-none">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                 <CardTitle className="text-base">Current Placement</CardTitle>
                 <StatusBadge status={placementStatus} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-muted/30">
                 <div><p className="text-[10px] uppercase font-bold text-muted-foreground">Host Company</p><p className="font-bold flex items-center gap-1"><Building2 className="h-3 w-3 text-primary" /> {placement.companyName}</p></div>
                 <div><p className="text-[10px] uppercase font-bold text-muted-foreground">Duration Schedule</p><p className="font-medium flex items-center gap-1"><Calendar className="h-3 w-3 text-primary" /> {placement.startDate} to {placement.endDate}</p></div>
                 <div><p className="text-[10px] uppercase font-bold text-muted-foreground">Academic Advisor</p><p className="font-medium flex items-center gap-1"><User className="h-3 w-3 text-emerald-500" /> {placement.advisorName}</p></div>
                 <div><p className="text-[10px] uppercase font-bold text-muted-foreground">Host Supervisor</p><p className="font-medium flex items-center gap-1"><User className="h-3 w-3 text-amber-500" /> {placement.supervisorName}</p></div>
              </div>
              
              <div className="space-y-2">
                 <div className="flex justify-between items-end">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Internship Progress</p>
                    <span className="text-xs font-bold text-primary">{placementStatus === 'active' ? '15%' : '0%'} Completed</span>
                 </div>
                 <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: placementStatus === 'active' ? '15%' : '0%' }} />
                 </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-none">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileCode2 className="h-5 w-5 text-purple-500" /> Project Definition & Analysis
              </CardTitle>
              <CardDescription>Define your technical project and submit analysis deliverables.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
                 <div className="flex justify-between items-start">
                    <div>
                       <p className="text-[10px] uppercase font-bold text-primary tracking-wider mb-1">Official Project Title</p>
                       {projectTitle ? <h4 className="font-bold text-base">{projectTitle}</h4> : <p className="text-sm italic text-muted-foreground">No project proposed yet</p>}
                    </div>
                    {projectTitle && <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-none">Pending Approval</Badge>}
                 </div>
                 {!projectTitle && !proposing && (
                    <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => setProposing(true)}>Propose Project Title</Button>
                 )}
                 {proposing && (
                    <div className="flex gap-2">
                       <Input value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder="e.g. Employee HR Portal" className="h-8 text-xs" />
                       <Button size="sm" className="h-8" onClick={handleProposeProject}>Submit</Button>
                    </div>
                 )}
              </div>

              <div className="space-y-2 pt-2 border-t">
                 <p className="text-xs font-bold text-muted-foreground">Analysis Phase Requirements</p>
                 <ul className="text-xs space-y-2">
                    <li className="flex items-center justify-between"><span className="text-muted-foreground">1. System Requirement Specification (SRS)</span><Badge variant="outline" className="text-[10px]">Pending</Badge></li>
                    <li className="flex items-center justify-between"><span className="text-muted-foreground">2. Use Case & ER Diagrams</span><Badge variant="outline" className="text-[10px]">Pending</Badge></li>
                    <li className="flex items-center justify-between"><span className="text-muted-foreground">3. System Design Document</span><Badge variant="outline" className="text-[10px]">Pending</Badge></li>
                 </ul>
                 <p className="text-[10px] text-muted-foreground mt-2 italic">Submit these via the Documents tab for Supervisor review.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card border-none h-fit">
          <CardHeader><CardTitle className="text-base">Recent Activities</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mockActivities.slice(0, 4).map((a, index) => {
                const Icon = TIMELINE_ICONS[a.type] || CheckCircle2;
                return (
                  <div key={a.id} className="relative flex gap-4">
                    {index !== 3 && <div className="absolute left-4 top-8 bottom-[-24px] w-px bg-border" />}
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 z-10 border-2 border-background">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="pt-1.5 space-y-1">
                      <p className="text-sm font-medium leading-none">{a.description}</p>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{new Date(a.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
