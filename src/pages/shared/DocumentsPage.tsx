import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatusBadge from "@/components/shared/StatusBadge";
import { mockDocuments } from "@/data/mockData";
import { Upload, FileText, Eye, Download, Trash2, Search } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { Document } from "@/types";

export default function DocumentsPage() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<Document | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = mockDocuments
    .filter(d => d.name.toLowerCase().includes(search.toLowerCase()))
    .filter(d => statusFilter === "all" || d.status === statusFilter);

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Documents</h1><p className="text-muted-foreground text-sm">Manage internship documents</p></div>
        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <DialogTrigger asChild><Button className="gradient-primary gap-2"><Upload className="h-4 w-4" /> Upload Document</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Upload Document</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Document Name</Label><Input placeholder="Document name" /></div>
              <div className="space-y-2">
                <Label>File</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/30 transition-colors">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
                  <p className="text-xs text-muted-foreground">PDF, DOCX, XLSX up to 10MB</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadOpen(false)}>Cancel</Button>
              <Button className="gradient-primary" onClick={() => { setUploadOpen(false); toast.success("Document uploaded!"); }}>Upload</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search documents..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((d) => (
          <Card key={d.id} className="shadow-card hover:shadow-elevated transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{d.name}</p>
                  <p className="text-xs text-muted-foreground">{d.size} · {d.uploadedAt}</p>
                  <p className="text-xs text-muted-foreground">By: {d.uploadedBy}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <StatusBadge status={d.status} />
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setSelected(d); setViewOpen(true); }}><Eye className="h-3.5 w-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7"><Download className="h-3.5 w-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Document Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center"><FileText className="h-6 w-6 text-primary" /></div>
                <div><p className="font-medium">{selected.name}</p><p className="text-xs text-muted-foreground">{selected.type.toUpperCase()} · {selected.size}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground">Uploaded By</p><p className="font-medium">{selected.uploadedBy}</p></div>
                <div><p className="text-muted-foreground">Date</p><p className="font-medium">{selected.uploadedAt}</p></div>
                <div><p className="text-muted-foreground">Status</p><StatusBadge status={selected.status} /></div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Download</Button>
                {selected.status === "pending" && (
                  <>
                    <Button className="gradient-primary" onClick={() => { setViewOpen(false); toast.success("Document approved!"); }}>Approve</Button>
                    <Button variant="destructive" onClick={() => { setViewOpen(false); toast.success("Document rejected!"); }}>Reject</Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
