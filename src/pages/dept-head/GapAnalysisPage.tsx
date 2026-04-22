import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/shared/StatsCard";
import { mockGapAnalysis } from "@/data/mockData";
import { TrendingUp, AlertTriangle, BookOpen, Briefcase, Download, RefreshCw } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";

const employmentData = [
  { name: "Hired by Intern Company", value: 35, color: "hsl(142, 71%, 45%)" },
  { name: "Hired Elsewhere", value: 25, color: "hsl(234, 89%, 63%)" },
  { name: "Continued Studies", value: 20, color: "hsl(38, 92%, 50%)" },
  { name: "Job Seeking", value: 20, color: "hsl(0, 0%, 70%)" },
];

const conversionRate = [
  { year: "2022", rate: 28 }, { year: "2023", rate: 35 }, { year: "2024", rate: 42 }, { year: "2025", rate: 48 },
];

const SEVERITY_STYLES: Record<string, string> = {
  high: "border-l-rose-500 bg-rose-500/5",
  medium: "border-l-amber-500 bg-amber-500/5",
  low: "border-l-blue-500 bg-blue-500/5",
};

export default function GapAnalysisPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Program Feedback & Gap Analysis</h1>
          <p className="text-muted-foreground text-sm">Identify skill gaps and track employment outcomes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => toast.success("Report exported!")}><Download className="h-4 w-4" /> Export</Button>
          <Button className="gradient-primary gap-2" onClick={() => toast.success("Analysis updated!")}><RefreshCw className="h-4 w-4" /> Refresh Data</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Internship→Job Rate" value="48%" icon={TrendingUp} trend={{ value: 6, positive: true }} description="conversion this year" />
        <StatsCard title="Skill Gaps Identified" value={mockGapAnalysis.length} icon={AlertTriangle} description="areas needing attention" />
        <StatsCard title="Courses Impacted" value={7} icon={BookOpen} description="curriculum updates suggested" />
        <StatsCard title="Placed Graduates" value="87%" icon={Briefcase} trend={{ value: 5, positive: true }} />
      </div>

      {/* Skill Gap Cards */}
      <Card className="shadow-card border-none">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-500" /> Identified Skill Gaps</CardTitle>
          <CardDescription>Based on evaluation data and supervisor feedback</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockGapAnalysis.map(gap => (
            <div key={gap.id} className={`p-4 rounded-xl border-l-4 ${SEVERITY_STYLES[gap.severity]} space-y-2`}>
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">{gap.skillArea}</h4>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${gap.severity === "high" ? "bg-rose-100 text-rose-700" : gap.severity === "medium" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                    {gap.severity}
                  </span>
                  <span className="text-xs text-muted-foreground">{gap.occurrenceCount} occurrences</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{gap.suggestedAction}</p>
              {gap.relatedCourses && (
                <div className="flex flex-wrap gap-1.5">
                  {gap.relatedCourses.map(c => (
                    <span key={c} className="px-2 py-0.5 rounded bg-muted text-[11px] font-medium">{c}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employment Outcomes */}
        <Card className="shadow-card border-none">
          <CardHeader>
            <CardTitle className="text-base">Employment Outcomes</CardTitle>
            <CardDescription>Post-internship career tracking</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={employmentData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value" label={({ name, value }) => `${value}%`}>
                    {employmentData.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full mt-2">
              {employmentData.map(item => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <div className="h-3 w-3 rounded-full" style={{ background: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-bold ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conversion Rate Trend */}
        <Card className="shadow-card border-none">
          <CardHeader>
            <CardTitle className="text-base">Internship → Job Conversion Rate</CardTitle>
            <CardDescription>Year-over-year improvement tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conversionRate}>
                  <XAxis dataKey="year" fontSize={12} axisLine={false} tickLine={false} />
                  <YAxis fontSize={12} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip formatter={(v: number) => `${v}%`} />
                  <Bar dataKey="rate" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
