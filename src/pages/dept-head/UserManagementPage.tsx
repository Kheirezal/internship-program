import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, UserPlus, Search, Mail, 
  Phone, Building2, MoreVertical, 
  ShieldCheck, ShieldAlert, Edit, 
  Send, UserCheck, Shield, GraduationCap,
  Briefcase, Loader2
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { ROLE_LABELS, UserRole } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockSystemUsers = [
  { id: "u1", name: "Dr. Sarah Johnson", email: "sarah.j@imem.edu", role: "internship_advisor", department: "Computer Science", status: "active" },
  { id: "u2", name: "Prof. Michael Chen", email: "michael.c@imem.edu", role: "internship_advisor", department: "Software Engineering", status: "active" },
  { id: "u3", name: "Alice Thompson", email: "alice.t@techcorp.com", role: "company_supervisor", department: "TechCorp Inc.", status: "active" },
  { id: "u4", name: "Dr. Kebede Alemu", email: "kebede.a@imem.edu", role: "internship_coordinator", department: "CS Department", status: "active" },
  { id: "u5", name: "Samuel Gebre", email: "samuel.g@imem.edu", role: "internship_student", department: "Computer Science", status: "pending" },
];

export default function UserManagementPage() {
  const [search, setSearch] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  
  const filteredUsers = mockSystemUsers.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.department.toLowerCase().includes(search.toLowerCase())
  );

  const handleInvite = () => {
    setIsInviting(true);
    setTimeout(() => {
      setIsInviting(false);
      toast.success("Role Invitation Sent!", {
        description: "The user will receive an email with their temporary password and activation link.",
        icon: <Send className="h-4 w-4" />
      });
    }, 1500);
  };

  const getByRole = (role: string) => filteredUsers.filter(u => u.role === role);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">System User Management</h1>
          <p className="text-muted-foreground text-sm">Register, invite and manage department staff and supervisors</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gradient-primary gap-2 shadow-lg shadow-primary/20">
              <UserPlus className="h-4 w-4" /> Invite New User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Invite System User</DialogTitle><DialogDescription>Send an invitation with a temporary password to give a staff member or supervisor access to the portal.</DialogDescription></DialogHeader>
            <div className="space-y-4 py-2">
               <div className="space-y-2"><Label>Full Name</Label><Input placeholder="Dr. Jane Smith" /></div>
               <div className="space-y-2"><Label>Email Address</Label><Input type="email" placeholder="jane.smith@university.edu" /></div>
               <div className="space-y-2">
                  <Label>System Role</Label>
                  <Select defaultValue="internship_advisor">
                     <SelectTrigger><SelectValue /></SelectTrigger>
                     <SelectContent>
                        <SelectItem value="internship_advisor">Academic Advisor</SelectItem>
                        <SelectItem value="company_supervisor">Company Supervisor</SelectItem>
                        <SelectItem value="internship_coordinator">Internship Coordinator</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
               <div className="space-y-2"><Label>Department / Organization</Label><Input placeholder="Computer Science" /></div>
            </div>
            <DialogFooter>
               <Button className="gradient-primary w-full gap-2" onClick={() => toast.success("Role Invitation Sent! Temporary password generated.")}><Send className="h-4 w-4" /> Send Invitation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, email or department..." 
            className="pl-9 h-10" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 flex-wrap h-auto">
          <TabsTrigger value="all" className="h-8">All Roles ({filteredUsers.length})</TabsTrigger>
          <TabsTrigger value="coordinators" className="h-8">Coordinators ({getByRole("internship_coordinator").length})</TabsTrigger>
          <TabsTrigger value="advisors" className="h-8">Advisors ({getByRole("internship_advisor").length})</TabsTrigger>
          <TabsTrigger value="supervisors" className="h-8">Supervisors ({getByRole("company_supervisor").length})</TabsTrigger>
          <TabsTrigger value="students" className="h-8">Students ({getByRole("internship_student").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <UserTable users={filteredUsers} />
        </TabsContent>
        <TabsContent value="coordinators" className="mt-0">
          <UserTable users={getByRole("internship_coordinator")} />
        </TabsContent>
        <TabsContent value="advisors" className="mt-0">
          <UserTable users={getByRole("internship_advisor")} />
        </TabsContent>
        <TabsContent value="supervisors" className="mt-0">
          <UserTable users={getByRole("company_supervisor")} />
        </TabsContent>
        <TabsContent value="students" className="mt-0">
          <UserTable users={getByRole("internship_student")} />
        </TabsContent>
      </Tabs>

      <div className="p-6 rounded-2xl bg-card border border-dashed flex items-start gap-4">
         <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center flex-shrink-0">
            <Shield className="h-5 w-5 text-primary" />
         </div>
         <div className="space-y-1">
            <h3 className="font-bold text-sm">Security Best Practices</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">As Department Head, you control the temporary password policy. Ensure all new users change their automatically generated credentials upon their first system entry. Deactivate roles immediately upon program completion or staff turnover.</p>
         </div>
      </div>
    </div>
  );
}

function UserTable({ users }: { users: typeof mockSystemUsers }) {
  if (users.length === 0) {
    return (
      <Card className="p-12 text-center text-muted-foreground shadow-sm border-none bg-muted/20">
        <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
        <p>No system users found matching your criteria.</p>
      </Card>
    );
  }

  return (
    <Card className="shadow-card border-none overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-muted/30 text-muted-foreground border-b border-border/50">
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-[10px]">User & Identity</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-[10px]">System Role</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-[10px]">Department/Org</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-[10px] text-center">Account Status</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-muted/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-card border flex items-center justify-center text-primary font-bold shadow-sm ring-2 ring-transparent group-hover:ring-primary/10 transition-all">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold">{u.name}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <Mail className="h-2.5 w-2.5" /> {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <RoleIndicator role={u.role as UserRole} />
                  </td>
                  <td className="px-6 py-4 font-medium text-muted-foreground italic">
                    {u.department}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge className={u.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 border-none' : 'bg-amber-500/10 text-amber-600 border-none'}>
                       {u.status === 'active' ? 'Active' : 'Pending Activation'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => toast.info("Profile editor coming soon")}>
                          <Edit className="h-4 w-4 mr-2" /> Edit User Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.success("Invitation resent successfully!")}>
                          <Send className="h-4 w-4 mr-2" /> Resend Invitation
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.success("Access credentials updated!")}>
                          <ShieldCheck className="h-4 w-4 mr-2" /> Update Permissions
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive font-bold" onClick={() => toast.error("User access revoked!")}>
                          <ShieldAlert className="h-4 w-4 mr-2" /> Revoke Access
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
  );
}

function RoleIndicator({ role }: { role: UserRole }) {
  const config = {
    internship_coordinator: { icon: Shield, label: ROLE_LABELS.internship_coordinator, color: "bg-blue-500/10 text-blue-600" },
    internship_advisor: { icon: UserCheck, label: ROLE_LABELS.internship_advisor, color: "bg-emerald-500/10 text-emerald-600" },
    department_head: { icon: ShieldCheck, label: ROLE_LABELS.department_head, color: "bg-purple-500/10 text-purple-600" },
    company_supervisor: { icon: Briefcase, label: ROLE_LABELS.company_supervisor, color: "bg-amber-500/10 text-amber-600" },
    internship_student: { icon: GraduationCap, label: ROLE_LABELS.internship_student, color: "bg-gray-500/10 text-gray-600" },
  };

  const { icon: Icon, label, color } = config[role] || config.internship_student;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${color}`}>
       <Icon className="h-3 w-3" />
       {label}
    </div>
  );
}
