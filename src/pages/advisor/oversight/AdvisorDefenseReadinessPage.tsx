import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import StatusBadge from "@/components/shared/StatusBadge";
import { mockDefenseReadinessReviews } from "@/data/mockData";
import { useAdvisorScope } from "./useAdvisorScope";
import { Target, CheckCircle2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import type { DefenseReadinessReview } from "@/types";

export default function AdvisorDefenseReadinessPage() {
  const navigate = useNavigate();
  const { myPlacementIds } = useAdvisorScope();
  const [defenseReviews, setDefenseReviews] = useState(() =>
    mockDefenseReadinessReviews.filter((d) => myPlacementIds.includes(d.placementId))
  );
  const [selected, setSelected] = useState<DefenseReadinessReview | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Defense Readiness
          </h2>
          <p className="text-sm text-muted-foreground">
            Evaluate presentation and defense preparation
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/internship-advisor/oversight/defense-schedule")}>
          Defense Schedule
        </Button>
      </div>

      <Card className="border-none bg-muted/30">
        <CardContent className="p-4 text-sm text-muted-foreground">
          Assess slides, demo, and Q&amp;A readiness. Schedule mock defenses when scores are below threshold.
        </CardContent>
      </Card>

      {defenseReviews.map((dr) => (
        <Card key={dr.id} className="shadow-card">
          <CardContent className="p-5 space-y-4">
            <div className="flex flex-wrap justify-between gap-2">
              <div>
                <h3 className="font-semibold">{dr.studentName}</h3>
                <p className="text-sm text-muted-foreground">Defense: {dr.defenseDate}</p>
              </div>
              <StatusBadge
                status={dr.status === "ready" ? "approved" : dr.status === "needs_work" ? "submitted" : "rejected"}
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Readiness Score</span>
                <span className="font-bold">{dr.readinessScore}%</span>
              </div>
              <Progress value={dr.readinessScore} className="h-2" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { label: "Presentation", ok: dr.presentationReady },
                { label: "Slides", ok: dr.slidesSubmitted },
                { label: "Demo", ok: dr.demoReady },
                { label: "Q&A Prep", ok: dr.qnaPrepared },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`p-2 rounded border text-center ${item.ok ? "bg-emerald-500/10 border-emerald-500/30" : "bg-muted/50"}`}
                >
                  {item.ok ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-500 mx-auto mb-1" />
                  )}
                  <p className="font-medium">{item.label}</p>
                </div>
              ))}
            </div>
            {dr.advisorNotes && <p className="text-sm text-muted-foreground">{dr.advisorNotes}</p>}
            <div className="flex gap-2">
              <Button
                size="sm"
                className="gradient-primary gap-1"
                onClick={() => {
                  setSelected(dr);
                  setReviewNotes(dr.advisorNotes ?? "");
                  setReviewOpen(true);
                }}
              >
                Update Assessment
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(`/internship-advisor/oversight/defense/${dr.id}`)}
              >
                Full Checklist
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Defense Readiness — {selected?.studentName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label>Advisor notes</Label>
            <Textarea
              rows={3}
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Mock defense feedback..."
            />
          </div>
          <DialogFooter>
            <Button
              className="gradient-primary"
              onClick={() => {
                if (!selected) return;
                setDefenseReviews((prev) =>
                  prev.map((d) =>
                    d.id === selected.id
                      ? {
                          ...d,
                          advisorNotes: reviewNotes,
                          status: "ready" as const,
                          readinessScore: Math.min(100, d.readinessScore + 15),
                          presentationReady: true,
                          qnaPrepared: true,
                        }
                      : d
                  )
                );
                setReviewOpen(false);
                toast.success("Readiness assessment updated");
              }}
            >
              Save Assessment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
