import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { mockAcademicGuidanceNotes } from "@/data/mockData";
import { useAdvisorScope } from "./useAdvisorScope";
import { Lightbulb, MessageSquare, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { AcademicGuidanceNote } from "@/types";

export default function AdvisorResearchGuidancePage() {
  const navigate = useNavigate();
  const { myPlacementIds } = useAdvisorScope();
  const [notes] = useState(() =>
    mockAcademicGuidanceNotes.filter((g) => myPlacementIds.includes(g.placementId))
  );
  const [selected, setSelected] = useState<AcademicGuidanceNote | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Research Guidance
          </h2>
          <p className="text-sm text-muted-foreground">
            Academic direction, methodology, and resources per advisee
          </p>
        </div>
        <Button className="gradient-primary gap-2" onClick={() => navigate("/internship-advisor/oversight/messages")}>
          <MessageSquare className="h-4 w-4" /> Send Guidance
        </Button>
      </div>

      <Card className="border-none bg-muted/30">
        <CardContent className="p-4 text-sm text-muted-foreground">
          Document research topics, direction, methodology guidance, and recommended resources for each advisee.
        </CardContent>
      </Card>

      {notes.map((note) => (
        <Card key={note.id} className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{note.studentName}</CardTitle>
            <CardDescription>{note.researchTopic}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Research Direction</p>
              <p>{note.researchDirection}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Methodology Guidance</p>
              <p>{note.methodologyGuidance}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Recommended Resources</p>
              <ul className="list-disc list-inside text-muted-foreground">
                {note.recommendedResources.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span>Updated: {new Date(note.lastUpdatedAt).toLocaleDateString()}</span>
              {note.nextMeetingDate && (
                <span className="text-primary font-medium">Next meeting: {note.nextMeetingDate}</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelected(note);
                  setEditOpen(true);
                }}
              >
                <Eye className="h-3.5 w-3.5 mr-1" /> View & Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(`/internship-advisor/oversight/guidance/${note.id}`)}
              >
                Full Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Research Guidance — {selected?.studentName}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div>
                <Label className="text-xs">Research direction</Label>
                <Textarea readOnly rows={3} value={selected.researchDirection} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Methodology</Label>
                <Textarea readOnly rows={3} value={selected.methodologyGuidance} className="mt-1" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Close
            </Button>
            <Button className="gradient-primary" onClick={() => navigate("/internship-advisor/oversight/messages")}>
              Continue in Messages
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
