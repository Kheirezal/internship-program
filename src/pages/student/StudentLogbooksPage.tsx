import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import StatusBadge from "@/components/shared/StatusBadge";
import { mockLogbooks } from "@/data/mockData";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function StudentLogbooksPage() {
  const [open, setOpen] = useState(false);
  const myLogbooks = mockLogbooks.filter(l => l.studentId === "u5");

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold">My Logbooks</h1><p className="text-muted-foreground text-sm">Daily internship journal</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary gap-2"><Plus className="h-4 w-4" /> Submit Logbook</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Submit Logbook Entry</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2"><Label>Title</Label><Input placeholder="What did you work on?" /></div>
              <div className="space-y-2"><Label>Date</Label><Input type="date" defaultValue={new Date().toISOString().split("T")[0]} /></div>
              <div className="space-y-2"><Label>Details</Label><Textarea placeholder="Describe your activities, learnings, and challenges..." rows={5} /></div>
              <Button className="w-full gradient-primary" onClick={() => { setOpen(false); toast.success("Logbook submitted!"); }}>Submit</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-3">
        {myLogbooks.map((l) => (
          <Card key={l.id} className="shadow-card hover:shadow-elevated transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{l.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{l.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">{l.date}</p>
                  {l.feedback && <p className="text-xs mt-2 p-2 rounded bg-muted"><strong>Feedback:</strong> {l.feedback}</p>}
                </div>
                <StatusBadge status={l.status} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
