import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import StatusBadge from "@/components/shared/StatusBadge";
import { mockFinalReportReviews } from "@/data/mockData";
import { useAdvisorScope } from "./useAdvisorScope";
import { Eye, BookMarked } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import type { FinalReportReview } from "@/types";

export default function AdvisorFinalReportsPage() {
  const navigate = useNavigate();
  const { myPlacementIds } = useAdvisorScope();
  const [finalReports, setFinalReports] = useState(() =>
    mockFinalReportReviews.filter((f) => myPlacementIds.includes(f.placementId))
  );
  const [selected, setSelected] = useState<FinalReportReview | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);

  const pendingCount = finalReports.filter((f) => f.status === "pending").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BookMarked className="h-5 w-5 text-primary" />
            Final Reports & Documentation
          </h2>
          <p className="text-sm text-muted-foreground">{pendingCount} pending review</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/internship-advisor/oversight/submissions")}>
          All Document Submissions
        </Button>
      </div>

      <Card className="border-none bg-muted/30">
        <CardContent className="p-4 text-sm text-muted-foreground">
          Review final internship reports and supporting documentation. Check completeness, methodology, and quality before approval.
        </CardContent>
      </Card>

      {finalReports.map((doc) => (
        <Card key={doc.id} className="shadow-card">
          <CardContent className="p-5 space-y-3">
            <div className="flex flex-wrap justify-between gap-2">
              <div>
                <h3 className="font-semibold">{doc.studentName}</h3>
                <p className="text-sm text-muted-foreground">{doc.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{doc.fileName}</p>
              </div>
              <StatusBadge status={doc.status} />
            </div>
            {doc.completenessScore != null && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Completeness</span>
                  <span className="font-medium">{doc.completenessScore}%</span>
                </div>
                <Progress value={doc.completenessScore} className="h-2" />
              </div>
            )}
            {doc.methodologyReview && (
              <p className="text-sm p-2 rounded bg-muted/50">
                <span className="font-medium">Methodology: </span>
                {doc.methodologyReview}
              </p>
            )}
            {doc.advisorFeedback && (
              <p className="text-xs italic text-amber-700 dark:text-amber-400">{doc.advisorFeedback}</p>
            )}
            <div className="flex gap-2">
              <Button
                size="sm"
                className="gradient-primary gap-1"
                onClick={() => {
                  setSelected(doc);
                  setReviewNotes(doc.advisorFeedback ?? "");
                  setReviewOpen(true);
                }}
              >
                <Eye className="h-3.5 w-3.5" /> Review Document
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(`/internship-advisor/oversight/final-docs/${doc.id}`)}
              >
                Open Detail
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Final Report — {selected?.studentName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label>Advisor feedback</Label>
            <Textarea
              rows={4}
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Revision notes or approval comments..."
            />
          </div>
          <DialogFooter className="gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={() => {
                if (!selected) return;
                setFinalReports((prev) =>
                  prev.map((f) =>
                    f.id === selected.id
                      ? { ...f, status: "revision_requested" as const, advisorFeedback: reviewNotes }
                      : f
                  )
                );
                setReviewOpen(false);
                toast.info("Revision requested");
              }}
            >
              Request Revision
            </Button>
            <Button
              className="gradient-primary"
              onClick={() => {
                if (!selected) return;
                setFinalReports((prev) =>
                  prev.map((f) =>
                    f.id === selected.id
                      ? { ...f, status: "approved" as const, advisorFeedback: reviewNotes }
                      : f
                  )
                );
                setReviewOpen(false);
                toast.success("Final report approved");
              }}
            >
              Approve Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
