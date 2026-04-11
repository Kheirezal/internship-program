import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/shared/StatusBadge";
import { mockPlacements, mockCompanies } from "@/data/mockData";
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Placement } from "@/types";

export default function PlacementsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<Placement | null>(null);

  const filtered = mockPlacements
    .filter(p => p.studentName.toLowerCase().includes(search.toLowerCase()) || p.companyName.toLowerCase().includes(search.toLowerCase()))
    .filter(p => statusFilter === "all" || p.status === statusFilter);

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Placements</h1><p className="text-muted-foreground text-sm">Manage internship placements</p></div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild><Button className="gradient-primary gap-2"><Plus className="h-4 w-4" /> New Placement</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Create New Placement</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Student Name</Label><Input placeholder="Student full name" /></div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select company" /></SelectTrigger>
                    <SelectContent>{mockCompanies.filter(c => c.status === "active").map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Advisor</Label><Input placeholder="Advisor name" /></div>
                <div className="space-y-2"><Label>Supervisor</Label><Input placeholder="Supervisor name" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Start Date</Label><Input type="date" /></div>
                <div className="space-y-2"><Label>End Date</Label><Input type="date" /></div>
              </div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button><Button className="gradient-primary" onClick={() => { setCreateOpen(false); toast.success("Placement created!"); }}>Create</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search placements..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-muted-foreground">
                <th className="p-4 font-medium">Student</th><th className="p-4 font-medium">Company</th><th className="p-4 font-medium">Advisor</th><th className="p-4 font-medium">Period</th><th className="p-4 font-medium">Progress</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium">{p.studentName}</td>
                    <td className="p-4">{p.companyName}</td>
                    <td className="p-4">{p.advisorName}</td>
                    <td className="p-4 text-xs">{p.startDate} — {p.endDate}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${p.progress}%` }} /></div>
                        <span className="text-xs">{p.progress}%</span>
                      </div>
                    </td>
                    <td className="p-4"><StatusBadge status={p.status} /></td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setSelected(p); setViewOpen(true); }}><Eye className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Placement Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground">Student</p><p className="font-medium">{selected.studentName}</p></div>
                <div><p className="text-muted-foreground">Company</p><p className="font-medium">{selected.companyName}</p></div>
                <div><p className="text-muted-foreground">Advisor</p><p className="font-medium">{selected.advisorName}</p></div>
                <div><p className="text-muted-foreground">Supervisor</p><p className="font-medium">{selected.supervisorName}</p></div>
                <div><p className="text-muted-foreground">Period</p><p className="font-medium">{selected.startDate} — {selected.endDate}</p></div>
                <div><p className="text-muted-foreground">Status</p><StatusBadge status={selected.status} /></div>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Progress</p>
                <div className="flex items-center gap-3">
                  <div className="h-3 flex-1 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${selected.progress}%` }} /></div>
                  <span className="font-medium">{selected.progress}%</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
