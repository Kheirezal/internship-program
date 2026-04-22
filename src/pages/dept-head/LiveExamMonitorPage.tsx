import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockExams, mockSubmissions } from "@/data/mockData";
import { ArrowLeft, Clock, Users, AlertCircle, RefreshCw, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "@/components/shared/StatusBadge";

export default function LiveExamMonitorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const exam = mockExams.find(e => e.id === id);

  useEffect(() => {
    if (!exam || exam.status !== "Active") {
      toast.error("This exam is not currently active.");
      navigate("/department-head/exams");
    }
  }, [exam, navigate]);

  if (!exam) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/department-head/exams")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Live Monitor: {exam.title}
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 animate-pulse">Live</span>
          </h1>
          <p className="text-muted-foreground text-sm">Real-time participation tracking and anti-cheating alerts</p>
        </div>
        <Button variant="outline" className="ml-auto gap-2" onClick={() => toast.success("Refreshed live data.")}>
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card border-none bg-emerald-50 dark:bg-emerald-900/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-800/50 flex items-center justify-center">
                <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Active Participants</p>
                <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">45 / 48</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card border-none">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-800/50 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Submitted</p>
                <h3 className="text-2xl font-bold">12</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card border-none">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-800/50 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Time Spent</p>
                <h3 className="text-2xl font-bold">24m 15s</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card border-none bg-rose-50 dark:bg-rose-900/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-rose-100 dark:bg-rose-800/50 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-rose-600 dark:text-rose-400">Connection Flags</p>
                <h3 className="text-2xl font-bold text-rose-700 dark:text-rose-300">2</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Student Roster</CardTitle>
          <CardDescription>Real-time status of all assigned students across selected courses.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="p-4 font-medium">Student Name</th>
                  <th className="p-4 font-medium">Course Focus</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Progress</th>
                  <th className="p-4 font-medium">Time Remaining</th>
                  <th className="p-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-muted/30">
                  <td className="p-4 font-medium">John Doe</td>
                  <td className="p-4"><span className="px-1.5 py-0.5 rounded bg-muted text-[10px]">CS301</span></td>
                  <td className="p-4"><StatusBadge status="active" /></td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                       <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden"><div className="h-full bg-primary w-[45%]" /></div>
                       <span className="text-xs text-muted-foreground font-mono">45%</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-bold text-amber-600">35:45</td>
                  <td className="p-4 text-xs text-muted-foreground">—</td>
                </tr>
                <tr className="border-b hover:bg-muted/30 opacity-70">
                  <td className="p-4 font-medium">Jane Smith</td>
                  <td className="p-4"><span className="px-1.5 py-0.5 rounded bg-muted text-[10px]">CS405</span></td>
                  <td className="p-4"><span className="text-emerald-600 font-medium text-xs">Submitted</span></td>
                  <td className="p-4"><div className="flex-1 h-2 rounded-full bg-emerald-500" /></td>
                  <td className="p-4">—</td>
                  <td className="p-4"><Button size="sm" variant="outline" className="h-6 text-[10px]" disabled>Finished</Button></td>
                </tr>
                <tr className="border-b hover:bg-muted/30">
                  <td className="p-4 font-medium">Sophie Chen</td>
                  <td className="p-4"><span className="px-1.5 py-0.5 rounded bg-muted text-[10px]">CS301</span></td>
                  <td className="p-4"><StatusBadge status="active" /></td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                       <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden"><div className="h-full bg-primary w-[80%]" /></div>
                       <span className="text-xs text-muted-foreground font-mono">80%</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-bold text-amber-600">12:30</td>
                  <td className="p-4 text-xs text-muted-foreground">—</td>
                </tr>
                <tr className="border-b hover:bg-muted/30 bg-rose-50/30 dark:bg-rose-900/10">
                  <td className="p-4 font-medium">Michael Jordan</td>
                  <td className="p-4"><span className="px-1.5 py-0.5 rounded bg-muted text-[10px]">CS405</span></td>
                  <td className="p-4"><span className="text-rose-600 font-medium text-xs flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Disconnected</span></td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                       <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden"><div className="h-full bg-primary w-[15%]" /></div>
                       <span className="text-xs text-muted-foreground font-mono">15%</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-bold">45:10</td>
                  <td className="p-4"><Button size="sm" variant="outline" className="h-7 text-xs border-rose-200 text-rose-600">Force Submit</Button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
