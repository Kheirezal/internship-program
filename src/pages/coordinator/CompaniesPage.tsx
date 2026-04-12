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
  const [form, setForm] = useState({ name: "", industry: "", address: "", contactPerson: "", contactEmail: "", contactPhone: "", status: "pending" as Company["status"], maxCapacity: 5, positions: "", requiredSkills: "", duration: "" });

  const filtered = mockCompanies
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.industry.toLowerCase().includes(search.toLowerCase()))
    .filter(c => statusFilter === "all" || c.status === statusFilter);

  const resetForm = () => setForm({ name: "", industry: "", address: "", contactPerson: "", contactEmail: "", contactPhone: "", status: "pending", maxCapacity: 5, positions: "", requiredSkills: "", duration: "" });

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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        <div className="space-y-2">
          <Label>Student Intake Capacity</Label>
          <Input type="number" min={1} value={values.maxCapacity} onChange={e => onChange({ ...values, maxCapacity: parseInt(e.target.value) || 0 })} />
          <p className="text-[10px] text-muted-foreground">Maximum number of interns this company can host.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
           <Label>Available Positions</Label>
           <Input value={values.positions} onChange={e => onChange({ ...values, positions: e.target.value })} placeholder="e.g. Developer, QA..." />
        </div>
        <div className="space-y-2">
           <Label>Required Skills</Label>
           <Input value={values.requiredSkills} onChange={e => onChange({ ...values, requiredSkills: e.target.value })} placeholder="e.g. React, Python..." />
        </div>
        <div className="space-y-2">
           <Label>Duration</Label>
           <Input value={values.duration} onChange={e => onChange({ ...values, duration: e.target.value })} placeholder="e.g. 4 Months" />
        </div>
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
                <th className="p-4 font-medium">Company</th><th className="p-4 font-medium">Industry</th><th className="p-4 font-medium">Contact</th><th className="p-4 font-medium">Capacity</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium text-right">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map((c) => {
                  const occupancyRate = (c.studentsCount / c.maxCapacity) * 100;
                  return (
                    <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/5 transition-transform hover:scale-105"><Building2 className="h-4.5 w-4.5 text-primary" /></div>
                          <div>
                             <p className="font-bold text-sm tracking-tight">{c.name}</p>
                             <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{c.industry}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-medium text-muted-foreground">{c.industry}</td>
                      <td className="p-4 text-xs">
                         <p className="font-bold text-foreground/80">{c.contactPerson}</p>
                         <p className="text-muted-foreground lowercase">{c.contactEmail}</p>
                      </td>
                      <td className="p-4">
                         <div className="space-y-1.5 w-32">
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-tight">
                               <span className="text-primary">{c.studentsCount} <span className="text-muted-foreground">/ {c.maxCapacity}</span></span>
                               <span className={occupancyRate >= 90 ? "text-destructive" : "text-muted-foreground"}>{Math.round(occupancyRate)}%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                               <div 
                                 className={`h-full transition-all duration-500 rounded-full ${occupancyRate >= 90 ? "bg-destructive" : occupancyRate >= 70 ? "bg-amber-500" : "bg-primary"}`} 
                                 style={{ width: `${Math.min(occupancyRate, 100)}%` }} 
                               />
                            </div>
                         </div>
                      </td>
                      <td className="p-4"><StatusBadge status={c.status} /></td>
                      <td className="p-4 text-right">
                        <div className="flex gap-1 justify-end">
                          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-all" onClick={() => { setSelected(c); setViewOpen(true); }}><Eye className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-all" onClick={() => { setSelected(c); setForm({ name: c.name, industry: c.industry, address: c.address, contactPerson: c.contactPerson, contactEmail: c.contactEmail, contactPhone: c.contactPhone, status: c.status, maxCapacity: c.maxCapacity, positions: c.positions?.join(", ") || "", requiredSkills: c.requiredSkills?.join(", ") || "", duration: c.duration || "" }); setEditOpen(true); }}><Edit className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive transition-all" onClick={() => { setSelected(c); setDeleteOpen(true); }}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><p className="text-[10px] uppercase font-bold text-primary tracking-[0.2em] mb-1">Partner Overview</p><DialogTitle className="text-2xl font-bold tracking-tight">{selected?.name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-6 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-muted/30 border"><p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Industry Focus</p><p className="font-bold text-primary">{selected.industry}</p></div>
                <div className="p-3 rounded-xl bg-muted/30 border"><p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Partnership Status</p><StatusBadge status={selected.status} /></div>
              </div>

              <div className="space-y-3">
                 <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Host Capacity Information</p>
                 <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
                    <div className="flex justify-between items-end">
                       <div>
                          <p className="text-3xl font-bold text-primary">{selected.studentsCount}</p>
                          <p className="text-xs text-muted-foreground font-medium">Currently Hosted Interns</p>
                       </div>
                       <div className="text-right">
                          <p className="text-xl font-bold">{selected.maxCapacity}</p>
                          <p className="text-xs text-muted-foreground font-medium">Total Capacity</p>
                       </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                       <div className="h-full bg-primary" style={{ width: `${(selected.studentsCount / selected.maxCapacity) * 100}%` }} />
                    </div>
                    <p className="text-[10px] text-muted-foreground italic font-medium">Available Slots: {selected.maxCapacity - selected.studentsCount} remaining</p>
                 </div>
              </div>

              <div className="space-y-3">
                 <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Internship Opportunities</p>
                 <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-xl bg-muted/30 border">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Target Roles</p>
                      <div className="flex flex-wrap gap-1">{(selected.positions && selected.positions.length > 0) ? selected.positions.map(p => <span key={p} className="px-2 py-1 bg-primary/10 text-primary text-[10px] rounded-md font-bold">{p}</span>) : <span className="text-xs text-muted-foreground">N/A</span>}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/30 border">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Required Skills</p>
                      <div className="flex flex-wrap gap-1">{(selected.requiredSkills && selected.requiredSkills.length > 0) ? selected.requiredSkills.map(s => <span key={s} className="px-2 py-1 border border-primary/20 text-foreground text-[10px] rounded-md">{s}</span>) : <span className="text-xs text-muted-foreground">N/A</span>}</div>
                    </div>
                 </div>
                 <p className="text-xs font-bold text-muted-foreground pl-1">Duration: <span className="text-foreground">{selected.duration || "TBD"}</span></p>
              </div>

              <div className="space-y-3">
                 <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Corporate Contact Details</p>
                 <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                       <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground"><Plus className="h-4 w-4" /></div>
                       <div><p className="text-[10px] font-bold text-muted-foreground uppercase">Point of Contact</p><p className="font-bold">{selected.contactPerson}</p></div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                       <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground"><Plus className="h-4 w-4" /></div>
                       <div><p className="text-[10px] font-bold text-muted-foreground uppercase">Direct Email</p><p className="font-bold underline decoration-primary/30 underline-offset-4">{selected.contactEmail}</p></div>
                    </div>
                 </div>
              </div>
              
              <div className="pt-4 border-t space-y-2">
                 <p className="text-[10px] font-bold uppercase text-muted-foreground">Office Headquaters</p>
                 <p className="font-medium text-foreground/80 leading-relaxed">{selected.address}</p>
              </div>
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
