import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import StatusBadge from "@/components/shared/StatusBadge";
import { mockFinalReportReviews } from "@/data/mockData";
import { ArrowLeft, Download } from "lucide-react";
import { toast } from "sonner";

export default function AdvisorFinalReportDetailPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const doc = mockFinalReportReviews.find((f) => f.id === reportId);

  if (!doc) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Report not found.
          <Button className="mt-4 block mx-auto" onClick={() => navigate("/internship-advisor/oversight/final-docs")}>
            Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/internship-advisor/oversight/final-docs")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold">{doc.title}</h2>
            <p className="text-sm text-muted-foreground">{doc.studentName}</p>
          </div>
        </div>
        <StatusBadge status={doc.status} />
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Document</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p className="font-mono text-muted-foreground">{doc.fileName}</p>
          <p className="text-xs text-muted-foreground">
            Submitted {new Date(doc.submittedAt).toLocaleString()}
          </p>
          {doc.completenessScore != null && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Completeness</span>
                <span className="font-bold">{doc.completenessScore}%</span>
              </div>
              <Progress value={doc.completenessScore} />
            </div>
          )}
          {doc.methodologyReview && (
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="font-medium mb-1">Methodology review</p>
              <p>{doc.methodologyReview}</p>
            </div>
          )}
          {doc.documentationQuality != null && (
            <p>
              Documentation quality: <strong>{doc.documentationQuality}/5</strong>
            </p>
          )}
          {doc.advisorFeedback && (
            <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5">
              <p className="font-medium text-amber-800 dark:text-amber-200">Advisor feedback</p>
              <p className="mt-1">{doc.advisorFeedback}</p>
            </div>
          )}
          <Button className="gradient-primary gap-2" onClick={() => toast.success("Download started")}>
            <Download className="h-4 w-4" /> Download {doc.fileName}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
