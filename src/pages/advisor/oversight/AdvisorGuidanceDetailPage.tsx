import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockAcademicGuidanceNotes } from "@/data/mockData";
import { ArrowLeft, MessageSquare } from "lucide-react";

export default function AdvisorGuidanceDetailPage() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const note = mockAcademicGuidanceNotes.find((g) => g.id === noteId);

  if (!note) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Guidance profile not found.
          <Button className="mt-4 block mx-auto" onClick={() => navigate("/internship-advisor/oversight/guidance")}>
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
          <Button variant="ghost" size="icon" onClick={() => navigate("/internship-advisor/oversight/guidance")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold">{note.studentName}</h2>
            <p className="text-sm text-primary font-medium">{note.researchTopic}</p>
          </div>
        </div>
        <Button className="gradient-primary gap-2" onClick={() => navigate("/internship-advisor/oversight/messages")}>
          <MessageSquare className="h-4 w-4" /> Message Student
        </Button>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Research Direction</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">{note.researchDirection}</CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Methodology Guidance</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">{note.methodologyGuidance}</CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Recommended Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside text-sm space-y-2 text-muted-foreground">
            {note.recommendedResources.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Last updated {new Date(note.lastUpdatedAt).toLocaleString()}
        {note.nextMeetingDate && ` · Next meeting ${note.nextMeetingDate}`}
      </p>
    </div>
  );
}
