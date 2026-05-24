import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockAdvisorProgressReports } from "@/data/mockData";
import { reportService } from "@/services/reportService";
import { ArrowLeft, Download, Star } from "lucide-react";
import { toast } from "sonner";
import { useMemo } from "react";

export default function AdvisorProgressReportDetailPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const report = mockAdvisorProgressReports.find((r) => r.id === reportId);
  const consolidated = useMemo(
    () => (report ? reportService.generateStudentProgress(report.studentId) : null),
    [report]
  );

  if (!report) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Progress report not found.
          <Button className="mt-4 block mx-auto" onClick={() => navigate("/internship-advisor/oversight/progress")}>
            Back to list
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/internship-advisor/oversight/progress")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold">{report.studentName}</h2>
          <p className="text-sm text-muted-foreground">{report.period}</p>
        </div>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Submitted Progress Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex items-center gap-1 text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < report.overallRating ? "fill-current" : "opacity-30"}`}
              />
            ))}
            <span className="text-foreground text-xs ml-2">{report.hoursLogged} hours logged</span>
          </div>
          <p>{report.summary}</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg border">
              <p className="font-medium text-emerald-700 dark:text-emerald-400 mb-2">Achievements</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                {report.keyAchievements.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="font-medium text-amber-700 dark:text-amber-400 mb-2">Challenges</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                {report.challenges.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
          {report.advisorNotes && (
            <p className="p-3 rounded bg-muted/50 italic">Advisor notes: {report.advisorNotes}</p>
          )}
        </CardContent>
      </Card>

      {consolidated && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Consolidated System Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">{consolidated.title}</p>
            <div className="p-4 rounded-lg border bg-muted/30">
              <pre className="text-xs whitespace-pre-wrap overflow-x-auto">
                {JSON.stringify(consolidated.data, null, 2)}
              </pre>
            </div>
            <Button
              className="gradient-primary gap-2"
              onClick={() => toast.success("Report downloaded")}
            >
              <Download className="h-4 w-4" /> Download PDF
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
