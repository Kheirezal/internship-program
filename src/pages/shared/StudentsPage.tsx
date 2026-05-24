import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatusBadge from "@/components/shared/StatusBadge";
import { mockPlacements } from "@/data/mockData";
import { Search, Eye, Building2, Send } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Placement } from "@/types";
import { mockLogbooks, mockAttendance, mockGrades, mockTasks } from "@/data/mockData";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const rolePath = user?.role.replace(/_/g, "-") || "shared";
  const subPath = user?.role === "company_supervisor" ? "interns" : "students";
  const isCoordinatorStudentsPage = location.pathname.startsWith("/internship-coordinator/students");

  const filtered = mockPlacements.filter(p => p.studentName.toLowerCase().includes(search.toLowerCase()));

  const getStudentStats = (studentId: string) => {
    const logbooks = mockLogbooks.filter(l => l.studentId === studentId);
    const attendance = mockAttendance.filter(a => a.studentId === studentId);
    const grade = mockGrades.find(g => g.studentId === studentId);
    const tasks = mockTasks.filter(t => t.assignedTo === studentId);
    const presentDays = attendance.filter(a => a.status === "present" || a.status === "late").length;
    return {
      logbooks: logbooks.length,
      attendanceRate: attendance.length > 0 ? Math.round((presentDays / attendance.length) * 100) : 0,
      grade: grade?.letterGrade || "Pending",
    };
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Students</h1>
          <p className="text-muted-foreground text-sm">All internship students</p>
        </div>
        {isCoordinatorStudentsPage && (
          <Button
            variant="outline"
            className="gap-2 shrink-0"
            onClick={() => navigate("/internship-coordinator/applications")}
          >
            <Send className="h-4 w-4" />
            Applications
          </Button>
        )}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search students..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => {
          const stats = getStudentStats(p.studentId);
          const detailUrl = `/${rolePath}/${subPath}/${p.id}`;
          
          return (
            <Card 
              key={p.id} 
              className="shadow-card hover:shadow-elevated transition-all duration-300 cursor-pointer group border-border/50 hover:border-primary/50" 
              onClick={() => navigate(detailUrl)}
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-sm group-hover:scale-110 transition-transform">
                    {p.studentName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-lg group-hover:text-primary transition-colors">{p.studentName}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Building2 className="h-3 w-3" /> {p.companyName}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Internship Progress</span>
                    <span className="font-bold text-primary">{p.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-primary transition-all duration-1000" 
                      style={{ width: `${p.progress}%` }} 
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="p-2 rounded-xl bg-muted/30 border border-border/30 text-center">
                      <p className="font-bold text-sm tracking-tight">{stats.logbooks}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">Logbooks</p>
                    </div>
                    <div className="p-2 rounded-xl bg-muted/30 border border-border/30 text-center">
                      <p className="font-bold text-sm tracking-tight">{stats.attendanceRate}%</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">Attend.</p>
                    </div>
                    <div className="p-2 rounded-xl bg-muted/30 border border-border/30 text-center">
                      <p className="font-bold text-sm tracking-tight">{stats.grade}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">Grade</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between">
                  <StatusBadge status={p.status} />
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="h-8 px-3 text-xs font-semibold gap-1.5 hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" /> View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
