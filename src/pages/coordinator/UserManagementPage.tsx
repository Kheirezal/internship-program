import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, UserPlus, Search, Mail, 
  Phone, Building2, MoreVertical, 
  ShieldCheck, ShieldAlert, Edit, Trash2
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { ROLE_LABELS } from "@/types";

const mockStaff = [
  { id: "s1", name: "Dr. Sarah Johnson", email: "sarah.j@imem.edu", phone: "+251 912 345678", role: "internship_advisor", department: "Computer Science", students: 12 },
  { id: "s2", name: "Prof. Michael Chen", email: "michael.c@imem.edu", phone: "+251 922 112233", role: "internship_advisor", department: "Software Engineering", students: 8 },
  { id: "s3", name: "Alice Thompson", email: "alice.t@techcorp.com", phone: "+251 933 445566", role: "company_supervisor", department: "TechCorp Inc.", students: 3 },
  { id: "s4", name: "David Miller", email: "david.m@globesys.com", phone: "+251 944 778899", role: "company_supervisor", department: "Global Systems", students: 2 },
  { id: "s5", name: "Dr. Robert Wilson", email: "robert.w@imem.edu", phone: "+251 955 001122", role: "internship_evaluator", department: "Information Systems", students: 15 },
];

export default function UserManagementPage() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  
  const filteredStaff = mockStaff.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase())
  );

  const getByRole = (role: string) => filteredStaff.filter(s => s.role === role);

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground text-sm">Manage advisors, supervisors, and evaluators</p>
        </div>
        <Button className="gradient-primary gap-2" onClick={() => toast.info("Staff registration modal coming soon!")}>
          <UserPlus className="h-4 w-4" /> Add Staff Member
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, email or department..." 
            className="pl-9" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="all">All Staff ({filteredStaff.length})</TabsTrigger>
          <TabsTrigger value="advisors">Advisors ({getByRole("internship_advisor").length})</TabsTrigger>
          <TabsTrigger value="supervisors">Supervisors ({getByRole("company_supervisor").length})</TabsTrigger>
          <TabsTrigger value="evaluators">Evaluators ({getByRole("internship_evaluator").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <StaffTable staff={filteredStaff} />
        </TabsContent>
        <TabsContent value="advisors" className="mt-0">
          <StaffTable staff={getByRole("internship_advisor")} />
        </TabsContent>
        <TabsContent value="supervisors" className="mt-0">
          <StaffTable staff={getByRole("company_supervisor")} />
        </TabsContent>
        <TabsContent value="evaluators" className="mt-0">
          <StaffTable staff={getByRole("internship_evaluator")} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StaffTable({ staff }: { staff: typeof mockStaff }) {
  if (staff.length === 0) {
    return (
      <Card className="p-12 text-center text-muted-foreground shadow-sm">
        <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
        <p>No staff members found matching your criteria.</p>
      </Card>
    );
  }

  return (
    <Card className="shadow-card overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/30 text-left text-muted-foreground border-b border-border/50">
                <th className="px-4 py-4 font-medium">Name & Role</th>
                <th className="px-4 py-4 font-medium">Contact Details</th>
                <th className="px-4 py-4 font-medium">Department / Company</th>
                <th className="px-4 py-4 font-medium text-center">Active Students</th>
                <th className="px-4 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{ROLE_LABELS[s.role as keyof typeof ROLE_LABELS]}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span>{s.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span>{s.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-medium text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5" />
                      {s.department}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="px-2 py-1 rounded-md bg-muted font-mono font-bold text-xs">{s.students}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => toast.info("Viewing details...")}>
                          <Edit className="h-4 w-4 mr-2" /> Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => toast.error("Staff member deactivated!")}>
                          <ShieldAlert className="h-4 w-4 mr-2" /> Deactivate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          if (s.role === 'company_supervisor') {
                            navigate(`/internship-coordinator/users/access?email=${s.email}&name=${encodeURIComponent(s.name)}`);
                          } else {
                            toast.success("Access permissions updated!");
                          }
                        }}>
                          <ShieldCheck className="h-4 w-4 mr-2" /> Permissions
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
