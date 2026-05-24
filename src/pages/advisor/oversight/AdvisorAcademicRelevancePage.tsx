import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  mockAcademicRelevanceReviews,
  mockSiteVisits,
} from "@/data/mockData";
import { useAdvisorScope } from "./useAdvisorScope";
import { Eye, GraduationCap, Star, MapPin } from "lucide-react";

const ALIGNMENT_COLORS: Record<string, string> = {
  strong: "text-emerald-600",
  moderate: "text-amber-600",
  weak: "text-destructive",
  pending: "text-muted-foreground",
};

export default function AdvisorAcademicRelevancePage() {
  const navigate = useNavigate();
  const { advisorId, myPlacementIds } = useAdvisorScope();
  const [reviews] = useState(() =>
    mockAcademicRelevanceReviews.filter((r) => myPlacementIds.includes(r.placementId))
  );
  const mySiteVisits = mockSiteVisits.filter((v) => !advisorId || v.advisorId === advisorId);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Academic Relevance
          </h2>
          <p className="text-sm text-muted-foreground">
            Monitor alignment between internship work and program outcomes
          </p>
        </div>
        <Button className="gradient-primary gap-2" onClick={() => navigate("/internship-advisor/oversight/site-visits")}>
          <MapPin className="h-4 w-4" /> Site Visits
        </Button>
      </div>

      <Card className="border-none bg-muted/30">
        <CardContent className="p-4 text-sm text-muted-foreground">
          Assess whether internship tasks align with program learning outcomes. Site visit ratings inform task relevance scores.
        </CardContent>
      </Card>

      {reviews.map((review) => (
        <Card key={review.id} className="shadow-card">
          <CardContent className="p-5 space-y-4">
            <div className="flex flex-wrap justify-between gap-2">
              <div>
                <h3 className="font-semibold">{review.studentName}</h3>
                <p className="text-sm text-primary font-medium">{review.projectTitle}</p>
              </div>
              <span className={`text-sm font-bold capitalize ${ALIGNMENT_COLORS[review.curriculumAlignment]}`}>
                {review.curriculumAlignment} alignment
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Relevance Score</p>
                <p className="font-bold text-lg">{review.relevanceScore > 0 ? `${review.relevanceScore}/5` : "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tech Stack Match</p>
                <p className="font-medium">
                  {review.techStackMatch ? "Yes" : review.curriculumAlignment === "pending" ? "TBD" : "No"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Research Component</p>
                <p className="font-medium">{review.researchComponent ? "Yes" : "No"}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Learning Objectives</p>
              <ul className="text-sm list-disc list-inside space-y-0.5">
                {review.learningObjectives.map((o, i) => (
                  <li key={i}>{o}</li>
                ))}
              </ul>
            </div>
            {review.advisorComments && (
              <p className="text-sm p-3 rounded-lg bg-muted/50">{review.advisorComments}</p>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/internship-advisor/oversight/site-visits")}
            >
              <Eye className="h-3.5 w-3.5 mr-1" /> View Site Visits
            </Button>
          </CardContent>
        </Card>
      ))}

      {mySiteVisits.filter((v) => v.taskRelevanceRating).length > 0 && (
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Site Visit — Task Relevance Ratings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {mySiteVisits
              .filter((v) => v.status === "completed" && v.taskRelevanceRating)
              .map((v) => (
                <div
                  key={v.id}
                  className="flex justify-between text-sm p-2 rounded border hover:bg-muted/30 cursor-pointer"
                  onClick={() => navigate("/internship-advisor/oversight/site-visits")}
                >
                  <span>
                    {v.studentName} @ {v.companyName}
                  </span>
                  <span className="font-medium flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-amber-500" />
                    {v.taskRelevanceRating}/5
                  </span>
                </div>
              ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
