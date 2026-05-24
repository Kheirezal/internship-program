import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import StatusBadge from "@/components/shared/StatusBadge";
import { mockDefenseReadinessReviews } from "@/data/mockData";
import { ArrowLeft, CheckCircle2, AlertTriangle } from "lucide-react";

const CHECKLIST = [
  { key: "presentationReady" as const, label: "Presentation structure reviewed" },
  { key: "slidesSubmitted" as const, label: "Defense slides submitted" },
  { key: "demoReady" as const, label: "Live demo rehearsed" },
  { key: "qnaPrepared" as const, label: "Q&A preparation completed" },
];

export default function AdvisorDefenseReadinessDetailPage() {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const review = mockDefenseReadinessReviews.find((d) => d.id === reviewId);

  if (!review) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Readiness record not found.
          <Button className="mt-4 block mx-auto" onClick={() => navigate("/internship-advisor/oversight/defense")}>
            Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/internship-advisor/oversight/defense")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold">{review.studentName}</h2>
          <p className="text-sm text-muted-foreground">Defense date: {review.defenseDate}</p>
        </div>
      </div>

      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Readiness Checklist</CardTitle>
          <StatusBadge
            status={review.status === "ready" ? "approved" : review.status === "needs_work" ? "submitted" : "rejected"}
          />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall score</span>
              <span className="font-bold">{review.readinessScore}%</span>
            </div>
            <Progress value={review.readinessScore} className="h-3" />
          </div>
          <ul className="space-y-3">
            {CHECKLIST.map((item) => {
              const ok = review[item.key];
              return (
                <li
                  key={item.key}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${ok ? "bg-emerald-500/5" : "bg-muted/30"}`}
                >
                  {ok ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                  )}
                  <span className="text-sm font-medium">{item.label}</span>
                </li>
              );
            })}
          </ul>
          {review.advisorNotes && (
            <div className="p-3 rounded-lg bg-muted/50 text-sm">
              <p className="font-medium mb-1">Advisor notes</p>
              <p>{review.advisorNotes}</p>
            </div>
          )}
          <Button onClick={() => navigate("/internship-advisor/oversight/defense-schedule")}>
            View defense schedule
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
