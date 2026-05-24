import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, UserPlus, Upload, Search, 
  FileSpreadsheet, FileText, Download,
  CheckCircle2, XCircle, AlertCircle,
  MoreVertical, Edit, ShieldCheck, Mail, Phone,
  Filter, ArrowLeft
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

const mockDepartmentStudents = [
  { id: "ST001", name: "Abebe Kebede", email: "abebe.k@imem.edu", phone: "+251 911 112233", section: "CS - A", year: "2026", status: "eligible" },
  { id: "ST002", name: "Sara Tadesse", email: "sara.t@imem.edu", phone: "+251 922 445566", section: "SWE - B", year: "2026", status: "eligible" },
  { id: "ST003", name: "Dawit Alemu", email: "dawit.a@imem.edu", phone: "+251 933 778899", section: "IS - A", year: "2026", status: "pending" },
  { id: "ST004", name: "Hirut Belay", email: "hirut.b@imem.edu", phone: "+251 944 113355", section: "CS - B", year: "2026", status: "ineligible" },
  { id: "ST005", name: "Samuel Gebre", email: "samuel.g@imem.edu", phone: "+251 955 667788", section: "SWE - A", year: "2026", status: "eligible" },
];

export default function StudentManagementPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  
  const handleImport = (format: string) => {
    setIsImporting(true);
    setTimeout(() => {
       setIsImporting(false);
       toast.success(`Success: Students imported from ${format}`, {
         description: "50 students added and validated. No duplicates found.",
         icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />
       });
    }, 1500);
  };

  const filteredStudents = mockDepartmentStudents.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.id.toLowerCase().includes(search.toLowerCase()) ||
    s.section.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 -ml-2 text-muted-foreground"
        onClick={() => navigate("/department-head/users")}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to User Management
      </Button>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Student Management</h1>
          <p className="text-muted-foreground text-sm">Control eligibility and register department students</p>
        </div>
        <div className="flex gap-2">
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2" disabled={isImporting}>
                   <Upload className="h-4 w-4" /> Import Students
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                 <DropdownMenuItem onClick={() => handleImport('Excel')}>
                   <FileSpreadsheet className="h-4 w-4 mr-2 text-emerald-600" /> Excel (XLSX)
                 </DropdownMenuItem>
                 <DropdownMenuItem onClick={() => handleImport('CSV')}>
                   <FileText className="h-4 w-4 mr-2 text-blue-600" /> CSV Format
                 </DropdownMenuItem>
                 <DropdownMenuItem onClick={() => handleImport('PDF')}>
                   <FileText className="h-4 w-4 mr-2 text-red-600" /> PDF Document
                 </DropdownMenuItem>
              </DropdownMenuContent>
           </DropdownMenu>
           <Dialog>
             <DialogTrigger asChild>
               <Button className="gradient-primary gap-2">
                 <UserPlus className="h-4 w-4" /> Add Student
               </Button>
             </DialogTrigger>
             <DialogContent>
               <DialogHeader><DialogTitle>Register New Student</DialogTitle></DialogHeader>
               <div className="space-y-4 py-2">
                   <div className="space-y-2"><Label>Full Name</Label><Input placeholder="John Doe" /></div>
                   <div className="space-y-2"><Label>Student ID</Label><Input placeholder="ST0001" /></div>
                   <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="student@example.com" /></div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Section</Label><Input placeholder="e.g. CS - A" /></div>
                      <div className="space-y-2"><Label>Year</Label><Input placeholder="2026" /></div>
                   </div>
               </div>
               <DialogFooter>
                  <Button className="gradient-primary w-full" onClick={() => toast.success("Student registered successfully!")}>Save Student</Button>
               </DialogFooter>
             </DialogContent>
           </Dialog>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
         <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by ID, name or section..." 
              className="pl-9 h-10" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
               <Download className="h-4 w-4" /> Export
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
               <Filter className="h-4 w-4" /> Filters
            </Button>
         </div>
      </div>

      <Card className="shadow-card border-none overflow-hidden">
         <CardContent className="p-0">
            <div className="overflow-x-auto">
               <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/30 text-left text-muted-foreground border-b border-border/50">
                       <th className="px-6 py-4 font-medium uppercase tracking-wider text-[10px]">Student Details</th>
                       <th className="px-6 py-4 font-medium uppercase tracking-wider text-[10px]">Section & Year</th>
                       <th className="px-6 py-4 font-medium uppercase tracking-wider text-[10px]">Contact</th>
                       <th className="px-6 py-4 font-medium uppercase tracking-wider text-[10px] text-center">Eligibility</th>
                       <th className="px-6 py-4 font-medium uppercase tracking-wider text-[10px] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {filteredStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-muted/20 transition-colors group">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                 {s.name.charAt(0)}
                              </div>
                              <div>
                                 <p className="font-bold text-sm">{s.name}</p>
                                 <p className="text-[10px] text-muted-foreground font-mono">{s.id}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4 font-medium">
                           <p className="text-sm">{s.section}</p>
                           <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{s.year} Academic Year</p>
                        </td>
                        <td className="px-6 py-4">
                           <div className="space-y-1 text-xs">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                 <Mail className="h-3 w-3" /> {s.email}
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                 <Phone className="h-3 w-3" /> {s.phone}
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <EligibilityBadge status={s.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                 <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical className="h-4 w-4" />
                                 </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                 <DropdownMenuItem onClick={() => toast.info("Profile view coming soon")}>
                                    <Edit className="h-4 w-4 mr-2" /> View Profile
                                 </DropdownMenuItem>
                                 <DropdownMenuItem onClick={() => toast.success("Temporary password generated!")}>
                                    <ShieldCheck className="h-4 w-4 mr-2" /> Assign Temporary Password
                                 </DropdownMenuItem>
                                 <DropdownMenuItem className="text-emerald-600 font-bold" onClick={() => toast.success("Eligibility approved!")}>
                                    <CheckCircle2 className="h-4 w-4 mr-2" /> Approve Eligibility
                                 </DropdownMenuItem>
                                 <DropdownMenuItem className="text-destructive" onClick={() => toast.error("Eligibility revoked!")}>
                                    <XCircle className="h-4 w-4 mr-2" /> Revoke Eligibility
                                 </DropdownMenuItem>
                              </DropdownMenuContent>
                           </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
         </CardContent>
      </Card>

      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-dashed">
         <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">Once you approve the eligible student list, you can submit it to the Internship Coordinator to begin the placement process.</p>
         </div>
         <Button className="gradient-primary h-9 gap-2 shadow-lg shadow-primary/20">
            Submit Approved List <Download className="h-4 w-4 rotate-180" />
         </Button>
      </div>
    </div>
  );
}

function EligibilityBadge({ status }: { status: string }) {
  switch (status) {
    case "eligible":
      return <Badge className="bg-emerald-500/10 text-emerald-600 border-none px-2 py-0.5 pointer-events-none uppercase text-[10px] tracking-wide">Eligible</Badge>;
    case "pending":
      return <Badge className="bg-amber-500/10 text-amber-600 border-none px-2 py-0.5 pointer-events-none uppercase text-[10px] tracking-wide">Pending Record</Badge>;
    case "ineligible":
      return <Badge className="bg-red-500/10 text-red-600 border-none px-2 py-0.5 pointer-events-none uppercase text-[10px] tracking-wide">Ineligible</Badge>;
    default:
      return null;
  }
}
