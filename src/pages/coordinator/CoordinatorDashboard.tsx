import StatsCard from "@/components/shared/StatsCard";
import StatusBadge from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, Briefcase, AlertCircle, TrendingUp, Eye } from "lucide-react";
import { mockCompanies, mockPlacements, mockComplaints, mockGrades } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useNavigate } from "react-router-dom";

const placementData = [
  { name: "Jan", count: 4 }, { name: "Feb", count: 6 }, { name: "Mar", count: 8 },
  { name: "Apr", count: 12 }, { name: "May", count: 10 }, { name: "Jun", count: 7 },
];

const statusData = [
  { name: "Active", value: 3, color: "hsl(142, 71%, 45%)" },
  { name: "Completed", value: 1, color: "hsl(234, 89%, 63%)" },
  { name: "Pending", value: 2, color: "hsl(38, 92%, 50%)" },
];

export default function CoordinatorDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Coordinator Dashboard</h1>
          <p className="text-muted-foreground text-sm">Overview of the internship program</p>
        </div>
        <Button className="gradient-primary gap-2" onClick={() => navigate("/internship-coordinator/reports")}>
          <TrendingUp className="h-4 w-4" /> View Reports
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cursor-pointer" onClick={() => navigate("/internship-coordinator/companies")}><StatsCard title="Total Companies" value={mockCompanies.length} icon={Building2} trend={{ value: 12, positive: true }} description="from last semester" /></div>
        <div className="cursor-pointer" onClick={() => navigate("/internship-coordinator/placements")}><StatsCard title="Active Placements" value={mockPlacements.filter(p => p.status === "active").length} icon={Briefcase} trend={{ value: 8, positive: true }} /></div>
        <div className="cursor-pointer" onClick={() => navigate("/internship-coordinator/students")}><StatsCard title="Total Students" value={mockPlacements.length} icon={Users} /></div>
        <div className="cursor-pointer" onClick={() => navigate("/internship-coordinator/complaints")}><StatsCard title="Open Complaints" value={mockComplaints.filter(c => c.status !== "closed").length} icon={AlertCircle} /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Placements by Month</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={placementData}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(234, 89%, 63%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Placement Status</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Placements</CardTitle>
          <Button size="sm" variant="outline" onClick={() => navigate("/internship-coordinator/placements")}>View All</Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-muted-foreground">
                <th className="pb-3 font-medium">Student</th><th className="pb-3 font-medium">Company</th><th className="pb-3 font-medium">Advisor</th><th className="pb-3 font-medium">Progress</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium">Action</th>
              </tr></thead>
              <tbody>
                {mockPlacements.map((p) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 font-medium">{p.studentName}</td>
                    <td className="py-3">{p.companyName}</td>
                    <td className="py-3">{p.advisorName}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${p.progress}%` }} /></div>
                        <span className="text-xs text-muted-foreground">{p.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3"><StatusBadge status={p.status} /></td>
                    <td className="py-3"><Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => navigate("/internship-coordinator/placements")}><Eye className="h-3.5 w-3.5" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
