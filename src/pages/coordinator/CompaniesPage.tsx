import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/shared/StatusBadge";
import { mockCompanies } from "@/data/mockData";
import { Plus, Search, Edit, Trash2, Eye, Building2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Company } from "@/types";

export default function CompaniesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Company | null>(null);
  const [form, setForm] = useState({ name: "", industry: "", address: "", contactPerson: "", contactEmail: "", contactPhone: "", status: "pending" as Company["status"] });

  const filtered = mockCompanies
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.industry.toLowerCase().includes(search.toLowerCase()))
    .filter(c => statusFilter === "all" || c.status === statusFilter);

  const resetForm = () => setForm({ name: "", industry: "", address: "", contactPerson: "", contactEmail: "", contactPhone: "", status: "pending" });

  const handleCreate = () => {
    toast.success(`Company "${form.name}" created successfully!`);
    setCreateOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    toast.success(`Company "${selected?.name}" updated!`);
    setEditOpen(false);
  };

  const handleDelete = () => {
    toast.success(`Company "${selected?.name}" deleted!`);
    setDeleteOpen(false);
    setSelected(null);
  };

  const FormFields = ({ values, onChange }: { values: typeof form; onChange: (v: typeof form) => void }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Company Name</Label><Input value={values.name} onChange={e => onChange({ ...values, name: e.target.value })} placeholder="Company name" /></div>
        <div className="space-y-2"><Label>Industry</Label><Input value={values.industry} onChange={e => onChange({ ...values, industry: e.target.value })} placeholder="Technology, Healthcare..." /></div>
      </div>
      <div className="space-y-2"><Label>Address</Label><Input value={values.address} onChange={e => onChange({ ...values, address: e.target.value })} placeholder="Full address" /></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2"><Label>Contact Person</Label><Input value={values.contactPerson} onChange={e => onChange({ ...values, contactPerson: e.target.value })} /></div>
        <div className="space-y-2"><Label>Email</Label><Input type="email" value={values.contactEmail} onChange={e => onChange({ ...values, contactEmail: e.target.value })} /></div>
        <div className="space-y-2"><Label>Phone</Label><Input value={values.contactPhone} onChange={e => onChange({ ...values, contactPhone: e.target.value })} /></div>
      </div>
      <div className="space-y-2">
        <Label>Status</Label>
        <Select value={values.status} onValueChange={v => onChange({ ...values, status: v as Company["status"] })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Companies</h1><p className="text-muted-foreground text-sm">Manage partner companies</p></div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary gap-2" onClick={resetForm}><Plus className="h-4 w-4" /> Add Company</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Add New Company</DialogTitle></DialogHeader>
            <FormFields values={form} onChange={setForm} />
            <DialogFooter><Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button><Button className="gradient-primary" onClick={handleCreate}>Create</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search companies..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-muted-foreground">
                <th className="p-4 font-medium">Company</th><th className="p-4 font-medium">Industry</th><th className="p-4 font-medium">Contact</th><th className="p-4 font-medium">Students</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center"><Building2 className="h-4 w-4 text-primary" /></div>
                        <span className="font-medium">{c.name}</span>
                      </div>
                    </td>
                    <td className="p-4">{c.industry}</td>
                    <td className="p-4"><span className="text-xs">{c.contactPerson}<br/>{c.contactEmail}</span></td>
                    <td className="p-4 font-mono">{c.studentsCount}</td>
                    <td className="p-4"><StatusBadge status={c.status} /></td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setSelected(c); setViewOpen(true); }}><Eye className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setSelected(c); setForm({ name: c.name, industry: c.industry, address: c.address, contactPerson: c.contactPerson, contactEmail: c.contactEmail, contactPhone: c.contactPhone, status: c.status }); setEditOpen(true); }}><Edit className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => { setSelected(c); setDeleteOpen(true); }}><Trash2 className="h-4 w-4" /></Button>
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
          <DialogHeader><DialogTitle>{selected?.name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground">Industry</p><p className="font-medium">{selected.industry}</p></div>
                <div><p className="text-muted-foreground">Status</p><StatusBadge status={selected.status} /></div>
                <div><p className="text-muted-foreground">Contact Person</p><p className="font-medium">{selected.contactPerson}</p></div>
                <div><p className="text-muted-foreground">Email</p><p className="font-medium">{selected.contactEmail}</p></div>
                <div><p className="text-muted-foreground">Phone</p><p className="font-medium">{selected.contactPhone}</p></div>
                <div><p className="text-muted-foreground">Students</p><p className="font-medium">{selected.studentsCount}</p></div>
              </div>
              <div><p className="text-muted-foreground">Address</p><p className="font-medium">{selected.address}</p></div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Edit Company</DialogTitle></DialogHeader>
          <FormFields values={form} onChange={setForm} />
          <DialogFooter><Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button><Button className="gradient-primary" onClick={handleEdit}>Save Changes</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Company</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete <strong>{selected?.name}</strong>? This action cannot be undone.</p>
          <DialogFooter><Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDelete}>Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
