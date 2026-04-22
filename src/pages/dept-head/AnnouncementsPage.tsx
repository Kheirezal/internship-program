import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockAnnouncements } from "@/data/mockData";
import { Plus, Megaphone, AlertTriangle, Info, Bell, Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Announcement } from "@/types";
import { useAuthStore } from "@/stores/authStore";

const PRIORITY_STYLES: Record<string, { bg: string; icon: React.ElementType }> = {
  normal: { bg: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800", icon: Info },
  important: { bg: "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800", icon: Bell },
  urgent: { bg: "bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-800", icon: AlertTriangle },
};

export default function AnnouncementsPage() {
  const { user } = useAuthStore();
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<Announcement | null>(null);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const canManage = user?.role === "department_head" || user?.role === "internship_coordinator";

  const filtered = mockAnnouncements.filter(a => priorityFilter === "all" || a.priority === priorityFilter);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Announcements</h1>
          <p className="text-muted-foreground text-sm">Broadcast messages, guidelines, and policy updates</p>
        </div>
        {canManage && (
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary gap-2"><Plus className="h-4 w-4" /> New Announcement</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Create Announcement</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2"><Label>Title</Label><Input placeholder="Announcement title" /></div>
                <div className="space-y-2"><Label>Content</Label><Textarea placeholder="Write your announcement..." rows={5} /></div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select defaultValue="normal">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="important">Important</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Students", "Advisors", "Coordinators", "Supervisors"].map(role => (
                      <label key={role} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors text-sm">
                        <input type="checkbox" defaultChecked className="rounded" />
                        {role}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button className="gradient-primary" onClick={() => { setCreateOpen(false); toast.success("Announcement published!"); }}>
                  <Megaphone className="h-4 w-4 mr-2" /> Publish
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Select value={priorityFilter} onValueChange={setPriorityFilter}>
        <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priority</SelectItem>
          <SelectItem value="normal">Normal</SelectItem>
          <SelectItem value="important">Important</SelectItem>
          <SelectItem value="urgent">Urgent</SelectItem>
        </SelectContent>
      </Select>

      <div className="space-y-4">
        {filtered.map((ann) => {
          const ps = PRIORITY_STYLES[ann.priority];
          const PIcon = ps.icon;
          return (
            <Card key={ann.id} className={`shadow-card border cursor-pointer hover:shadow-elevated transition-all ${ps.bg}`}
              onClick={() => { setSelected(ann); setViewOpen(true); }}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-0.5"><PIcon className="h-5 w-5" /></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-base">{ann.title}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-background/50">
                          {ann.priority}
                        </span>
                      </div>
                      <p className="text-sm line-clamp-2 opacity-80">{ann.content}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs opacity-60">
                        <span>By {ann.authorName}</span>
                        <span>•</span>
                        <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>To: {ann.targetRoles.map(r => r.replace("internship_", "").replace("_", " ")).join(", ")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setSelected(ann); setViewOpen(true); }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {canManage && (
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={(e) => { e.stopPropagation(); toast.success("Announcement deleted"); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{selected?.title}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${PRIORITY_STYLES[selected.priority].bg}`}>{selected.priority}</span>
                <span className="text-muted-foreground">by {selected.authorName}</span>
              </div>
              <p className="leading-relaxed whitespace-pre-wrap">{selected.content}</p>
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-muted/50">
                <div><p className="text-muted-foreground text-xs">Published</p><p className="font-medium">{new Date(selected.createdAt).toLocaleString()}</p></div>
                <div><p className="text-muted-foreground text-xs">Target</p><p className="font-medium capitalize">{selected.targetRoles.map(r => r.replace("internship_", "").replace("_", " ")).join(", ")}</p></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
