import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import StatusBadge from "@/components/shared/StatusBadge";
import { mockAdvisorProgressReports } from "@/data/mockData";
import { useAdvisorScope } from "./useAdvisorScope";
import { Eye, Download, Star, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import type { AdvisorProgressReport } from "@/types";

export default function AdvisorProgressReportsPage() {
  const navigate = useNavigate();
  const { myPlacementIds } = useAdvisorScope();
  const [reports, setReports] = useState(() =>
    mockAdvisorProgressReports.filter((r) => myPlacementIds.includes(r.placementId))
  );
  const [selected, setSelected] = useState<AdvisorProgressReport | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);

  const pendingCount = useMemo(
    () => reports.filter((r) => r.status === "pending_review").length,
    [reports]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Progress Reports
          </h2>
          <p className="text-sm text-muted-foreground">
            {pendingCount} pending review · {reports.length} total submissions
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/internship-advisor/reports")}>
          Program Reports
        </Button>
      </div>

      <Card className="border-none bg-muted/30">
        <CardContent className="p-4 text-sm text-muted-foreground">
          Review student-submitted summarized progress reports (mid-term and weekly). Approve, flag concerns, or open a consolidated summary.
        </CardContent>
      </Card>

      {reports.map((report) => (
        <Card key={report.id} className="shadow-card">
          <CardContent className="p-5 space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold">{report.studentName}</h3>
                <p className="text-sm text-muted-foreground">
                  {report.period} · {report.hoursLogged} hours logged
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < report.overallRating ? "fill-current" : "opacity-30"}`}
                    />
                  ))}
                </div>
                <StatusBadge status={report.status === "pending_review" ? "submitted" : report.status} />
              </div>
            </div>
            <p className="text-sm line-clamp-2">{report.summary}</p>
            {report.advisorNotes && (
              <p className="text-xs p-2 rounded bg-muted/50 italic">Advisor notes: {report.advisorNotes}</p>
            )}
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                className="gap-1"
                onClick={() => navigate(`/internship-advisor/oversight/progress/${report.id}`)}
              >
                <Download className="h-3.5 w-3.5" /> View Summary
              </Button>
              {report.status === "pending_review" && (
                <Button
                  size="sm"
                  className="gradient-primary gap-1"
                  onClick={() => {
                    setSelected(report);
                    setReviewNotes("");
                    setReviewOpen(true);
                  }}
                >
                  <Eye className="h-3.5 w-3.5" /> Review Report
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Progress Report — {selected?.studentName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label>Advisor feedback</Label>
            <Textarea
              rows={4}
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Comments for the student..."
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                if (!selected) return;
                setReports((prev) =>
                  prev.map((r) =>
                    r.id === selected.id
                      ? { ...r, status: "flagged" as const, advisorNotes: reviewNotes }
                      : r
                  )
                );
                setReviewOpen(false);
                toast.warning("Report flagged for follow-up");
              }}
            >
              Flag Concern
            </Button>
            <Button
              className="gradient-primary"
              onClick={() => {
                if (!selected) return;
                setReports((prev) =>
                  prev.map((r) =>
                    r.id === selected.id
                      ? { ...r, status: "reviewed" as const, advisorNotes: reviewNotes }
                      : r
                  )
                );
                setReviewOpen(false);
                toast.success("Progress report reviewed");
              }}
            >
              Mark Reviewed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
