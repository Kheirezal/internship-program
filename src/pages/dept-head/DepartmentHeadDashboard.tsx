import StatsCard from "@/components/shared/StatsCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, UserCheck, ShieldCheck, 
  BarChart3, FileText, UserPlus, 
  Upload, CheckCircle2, AlertCircle,
  TrendingUp, Building2, Briefcase
} from "lucide-react";
import { mockPlacements, mockCompanies } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { 
  ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell 
} from "recharts";

const data = [
  { name: 'Computer Science', placed: 45, unplaced: 12 },
  { name: 'Software Eng', placed: 38, unplaced: 8 },
  { name: 'Info Systems', placed: 30, unplaced: 15 },
  { name: 'Cybersecurity', placed: 25, unplaced: 5 },
];

const eligibilityData = [
  { name: 'Eligible', value: 138, color: '#10b981' },
  { name: 'Ineligible', value: 42, color: '#f43f5e' },
  { name: 'Pending', value: 20, color: '#f59e0b' },
];

export default function DepartmentHeadDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Department Head Overview</h1>
          <p className="text-muted-foreground text-sm">Academic oversight, student eligibility, and user administration</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => navigate("/department-head/students")}>
             <Upload className="h-4 w-4" /> Import Students
          </Button>
          <Button className="gradient-primary gap-2" onClick={() => navigate("/department-head/users")}>
             <UserPlus className="h-4 w-4" /> System Users
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Department Students" 
          value={200} 
          icon={Users} 
          description="Across all sections"
        />
        <StatsCard 
          title="Eligible for Internship" 
          value={138} 
          icon={ShieldCheck} 
          trend={{ value: 85, positive: true }} 
          description="Academic requirements met"
        />
        <StatsCard 
          title="Placement Rate" 
          value="72%" 
          icon={Briefcase} 
          trend={{ value: 12, positive: true }} 
          description="Students placed in companies"
        />
        <StatsCard 
          title="Partner Companies" 
          value={mockCompanies.length} 
          icon={Building2} 
          description="Active collaboration"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-card border-none">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Placement Progress by Section
            </CardTitle>
            <CardDescription>Comparison of placed vs unplaced students across department sections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" fontSize={12} axisLine={false} tickLine={false} />
                  <YAxis fontSize={12} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Legend iconType="circle" />
                  <Bar dataKey="placed" name="Placed Students" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={30} />
                  <Bar dataKey="unplaced" name="Unplaced Students" fill="#E2E8F0" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-none">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Eligibility Status
            </CardTitle>
            <CardDescription>Overall department distribution</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={eligibilityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {eligibilityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full mt-4">
               {eligibilityData.map((item) => (
                 <div key={item.name} className="text-center">
                    <p className="text-xs text-muted-foreground font-medium">{item.name}</p>
                    <p className="text-sm font-bold" style={{ color: item.color }}>{item.value}</p>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card className="shadow-card border-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-base">System Access Control</CardTitle>
                <CardDescription>Overview of registered department users</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary gap-1" onClick={() => navigate("/department-head/users")}>
                Manage <UserCheck className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  {[
                    { label: "Internship Coordinators", count: 2, icon: ShieldCheck, color: "text-blue-500" },
                    { label: "Academic Advisors", count: 8, icon: UserCheck, color: "text-emerald-500" },
                    { label: "External Supervisors", count: 12, icon: Building2, color: "text-amber-500" },
                  ].map((role) => (
                    <div key={role.label} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-transparent hover:border-primary/20 transition-all">
                       <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-card ${role.color}`}>
                             <role.icon className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-medium">{role.label}</span>
                       </div>
                       <span className="font-bold">{role.count}</span>
                    </div>
                  ))}
               </div>
            </CardContent>
         </Card>

         <Card className="shadow-card border-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-base">Program Actions Required</CardTitle>
                <CardDescription>Tasks requiring department head attention</CardDescription>
              </div>
              <AlertCircle className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
               <div className="space-y-3">
                  <div className="p-4 rounded-xl border-l-4 border-l-amber-500 bg-amber-500/5 space-y-2">
                     <p className="text-sm font-bold">Approve Intern Eligibility (Batch 2026)</p>
                     <p className="text-xs text-muted-foreground">20 students are pending academic record verification before placement begins.</p>
                     <Button size="sm" className="h-7 text-xs bg-amber-500 hover:bg-amber-600 border-none text-white" onClick={() => navigate("/department-head/students")}>Review List</Button>
                  </div>
                  <div className="p-4 rounded-xl border-l-4 border-l-blue-500 bg-blue-500/5 space-y-2">
                     <p className="text-sm font-bold">New Partner Company Induction</p>
                     <p className="text-xs text-muted-foreground">Global Systems Inc. requested to join the program. Approve partnership agreement.</p>
                     <Button size="sm" className="h-7 text-xs bg-blue-500 hover:bg-blue-600 border-none text-white" onClick={() => navigate("/department-head/companies")}>View Details</Button>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
