import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockRecommendations, mockPlacements } from "@/data/mockData";
import { Plus, Star, Award, Eye, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Recommendation } from "@/types";
import { Slider } from "@/components/ui/slider";

export default function RecommendationsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<Recommendation | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Recommendations</h1>
          <p className="text-muted-foreground text-sm">Final recommendations for intern completion or employment</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary gap-2"><Plus className="h-4 w-4" /> New Recommendation</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Write Recommendation</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Student</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                  <SelectContent>
                    {mockPlacements.filter(p => p.status === "active" || p.status === "completed").map(p => (
                      <SelectItem key={p.id} value={p.studentId}>{p.studentName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Recommendation Type</Label>
                <Select defaultValue="completion">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completion">Internship Completion</SelectItem>
                    <SelectItem value="employment">Employment Recommendation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Overall Rating</Label>
                <Slider defaultValue={[4]} max={5} min={1} step={1} />
                <p className="text-xs text-muted-foreground flex justify-between"><span>1 — Below Expectations</span><span>5 — Outstanding</span></p>
              </div>
              <div className="space-y-2"><Label>Key Strengths</Label><Textarea placeholder="Describe the student's strengths..." rows={3} /></div>
              <div className="space-y-2"><Label>Areas for Improvement</Label><Textarea placeholder="Suggestions for growth..." rows={2} /></div>
              <div className="space-y-2"><Label>Additional Comments</Label><Textarea placeholder="Any other remarks..." rows={2} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button className="gradient-primary" onClick={() => { setCreateOpen(false); toast.success("Recommendation submitted!"); }}>
                <ThumbsUp className="h-4 w-4 mr-2" /> Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {mockRecommendations.map(rec => (
          <Card key={rec.id} className="shadow-card border-none hover:shadow-elevated transition-all cursor-pointer" onClick={() => { setSelected(rec); setViewOpen(true); }}>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{rec.studentName}</h3>
                  <p className="text-sm text-muted-foreground">by {rec.supervisorName}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${rec.type === "employment" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"}`}>
                  {rec.type === "employment" ? "Employment" : "Completion"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < rec.rating ? "text-amber-400 fill-amber-400" : "text-muted"}`} />
                ))}
                <span className="ml-2 text-sm font-bold">{rec.rating}/5</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{rec.strengths}</p>
              <p className="text-xs text-muted-foreground">Submitted: {rec.submittedAt}</p>
            </CardContent>
          </Card>
        ))}
        {mockRecommendations.length === 0 && (
          <Card className="col-span-2 shadow-card border-none">
            <CardContent className="p-8 text-center">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No recommendations yet. Create one for your interns who are completing their internship.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Recommendation — {selected?.studentName}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground text-xs">Student</p><p className="font-medium">{selected.studentName}</p></div>
                <div><p className="text-muted-foreground text-xs">Supervisor</p><p className="font-medium">{selected.supervisorName}</p></div>
                <div><p className="text-muted-foreground text-xs">Type</p><p className="font-medium capitalize">{selected.type}</p></div>
                <div><p className="text-muted-foreground text-xs">Submitted</p><p className="font-medium">{selected.submittedAt}</p></div>
              </div>
              <div className="flex items-center gap-1 p-3 rounded-lg bg-muted/50">
                <span className="text-muted-foreground mr-2">Rating:</span>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < selected.rating ? "text-amber-400 fill-amber-400" : "text-muted"}`} />
                ))}
                <span className="ml-2 font-bold">{selected.rating}/5</span>
              </div>
              <div><p className="text-muted-foreground text-xs mb-1">Key Strengths</p><p className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-200 dark:border-emerald-800">{selected.strengths}</p></div>
              <div><p className="text-muted-foreground text-xs mb-1">Areas for Improvement</p><p className="p-3 rounded-lg bg-amber-500/5 border border-amber-200 dark:border-amber-800">{selected.improvements}</p></div>
              <div><p className="text-muted-foreground text-xs mb-1">Comments</p><p className="p-3 rounded-lg bg-muted/50">{selected.comments}</p></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
