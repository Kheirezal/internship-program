import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/shared/StatusBadge";
import { mockPlacements, mockCompanies } from "@/data/mockData";
import {
  Plus,
  Search,
  Eye,
  Edit,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  UserPlus,
  CloudDownload,
  FileType,
  ChevronDown,
  FileJson,
  FileText,
  Briefcase,
  BookOpen,
} from "lucide-react";
import { useState, useRef, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import type { Placement } from "@/types";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function PlacementsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<Placement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importStage, setImportStage] = useState<"upload" | "preview" | "complete">("upload");
  const [importedStudents, setImportedStudents] = useState<
    {
      id: string;
      name: string;
      department?: string;
      gpa?: number;
      assignedCompany?: string;
      status?: string;
    }[]
  >([]);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const rolePath = user?.role.replace(/_/g, "-") || "shared";
  const isCoordinator = user?.role === "internship_coordinator";
  const isAdvisor = user?.role === "internship_advisor";

  const scopedPlacements = useMemo(() => {
    if (isAdvisor && user?.id) {
      return mockPlacements.filter((p) => p.advisorId === user.id);
    }
    return mockPlacements;
  }, [isAdvisor, user?.id]);

  const filtered = scopedPlacements
    .filter(
      (p) =>
        p.studentName.toLowerCase().includes(search.toLowerCase()) ||
        p.companyName.toLowerCase().includes(search.toLowerCase()) ||
        (p.projectTitle?.toLowerCase().includes(search.toLowerCase()) ?? false)
    )
    .filter((p) => statusFilter === "all" || p.status === statusFilter);

  const handleExport = (format: string) => {
    toast.success(`Placement list exported as ${format.toUpperCase()}`, {
      description: isAdvisor
        ? `${filtered.length} assigned placement(s) included.`
        : `${filtered.length} placement(s) included.`,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      setTimeout(() => {
        setImportedStudents([
          { id: "s101", name: "Sara Abraham", department: "Software Engineering", gpa: 3.8 },
          { id: "s102", name: "Kebede Molla", department: "Information Systems", gpa: 3.5 },
          { id: "s103", name: "Marta Yosef", department: "Computer Science", gpa: 3.9 },
          { id: "s104", name: "Dawit Isayas", department: "Software Engineering", gpa: 3.2 },
          { id: "s105", name: "Hirut Bekele", department: "IT Management", gpa: 3.6 },
        ]);
        setImportStage("preview");
        setIsProcessing(false);
        toast.success("Excel file parsed successfully", {
          description: "5 students found ready for assignment.",
        });
      }, 1500);
    }
  };

  const runAutoAssign = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const companies = [...mockCompanies].filter((c) => c.status === "active");
      const results = importedStudents.map((student) => {
        const availableCompany = companies.find((c) => c.maxCapacity - c.studentsCount > 0);
        if (availableCompany) {
          availableCompany.studentsCount++;
          return { ...student, assignedCompany: availableCompany.name, status: "success" };
        }
        return { ...student, assignedCompany: "No Capacity Available", status: "error" };
      });
      setImportedStudents(results);
      setImportStage("complete");
      setIsProcessing(false);
      toast.success("Bulk assignment complete", {
        description: "Students have been distributed based on company capacity.",
      });
    }, 2000);
  };

  const openPlacement = (p: Placement) => {
    navigate(`/${rolePath}/placements/${p.id}`);
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {isAdvisor ? "My Student Placements" : "Placements"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isAdvisor
              ? `View internship placements for students assigned to you${user?.name ? ` (${user.name})` : ""}`
              : "Manage internship placements across the program"}
          </p>
        </div>

        {isCoordinator && (
          <div className="flex items-center gap-2 flex-wrap">
            <Dialog
              open={bulkOpen}
              onOpenChange={(open) => {
                setBulkOpen(open);
                if (!open) setImportStage("upload");
              }}
            >
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5">
                  <FileSpreadsheet className="h-4 w-4" /> Bulk Assign
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Bulk Student Assignment</DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    Upload an Excel list of students to automatically distribute them across active
                    companies.
                  </p>
                </DialogHeader>

                {importStage === "upload" && (
                  <div
                    className="mt-4 border-2 border-dashed border-muted rounded-2xl p-12 flex flex-col items-center justify-center gap-4 hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileUpload}
                    />
                    {isProcessing ? (
                      <div className="flex flex-col items-center gap-2 text-primary">
                        <Loader2 className="h-10 w-10 animate-spin" />
                        <p className="font-bold animate-pulse">Analyzing Spreadsheet...</p>
                      </div>
                    ) : (
                      <>
                        <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                          <Download className="h-8 w-8" />
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-lg">Click to upload or drag & drop</p>
                          <p className="text-sm text-muted-foreground">
                            Microsoft Excel (.xlsx, .xls) or CSV
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {importStage === "preview" && (
                  <div className="space-y-4">
                    <div className="rounded-xl border bg-muted/30 overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead className="text-right">GPA</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {importedStudents.map((s) => (
                            <TableRow key={s.id}>
                              <TableCell className="font-medium">{s.name}</TableCell>
                              <TableCell>{s.department}</TableCell>
                              <TableCell className="text-right font-mono">{s.gpa}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <div className="text-sm">
                        <p className="font-bold text-primary">System Recommendation</p>
                        <p className="text-muted-foreground">
                          The algorithm will prioritize companies with high capacity and active
                          partnership status.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {importStage === "complete" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4 bg-muted/50 p-3 rounded-lg border border-dashed">
                      <div>
                        <p className="text-xs font-bold text-primary uppercase">Summary</p>
                        <p className="text-sm font-medium">
                          {importedStudents.filter((s) => s.status === "success").length} Students
                          Successfully Assigned
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-2 font-bold shadow-sm">
                            <CloudDownload className="h-4 w-4" /> Export Report{" "}
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleExport("pdf")} className="gap-2">
                            <FileText className="h-4 w-4 text-red-500" /> PDF Document
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExport("xlsx")} className="gap-2">
                            <FileSpreadsheet className="h-4 w-4 text-emerald-500" /> Excel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-1">
                      {importedStudents.map((s, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-xl border bg-card shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                s.status === "success"
                                  ? "bg-emerald-500/10 text-emerald-500"
                                  : "bg-destructive/10 text-destructive"
                              }`}
                            >
                              {s.status === "success" ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : (
                                <AlertCircle className="h-4 w-4" />
                              )}
                            </div>
                            <span className="font-semibold text-sm">{s.name}</span>
                          </div>
                          <Badge variant={s.status === "success" ? "secondary" : "destructive"}>
                            {s.assignedCompany}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <DialogFooter className="mt-6">
                  <Button variant="ghost" onClick={() => setBulkOpen(false)}>
                    Close
                  </Button>
                  {importStage === "preview" && (
                    <Button
                      className="gradient-primary gap-2"
                      onClick={runAutoAssign}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <UserPlus className="h-4 w-4" />
                      )}
                      Process & Auto-assign
                    </Button>
                  )}
                  {importStage === "complete" && (
                    <Button
                      className="gradient-primary gap-2"
                      onClick={() => {
                        setBulkOpen(false);
                        toast.success("Placements updated successfully!");
                      }}
                    >
                      Finalize Placements
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5">
                  <Download className="h-4 w-4" /> Export All
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport("pdf")}>As PDF</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("csv")}>As CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("xlsx")}>As Excel</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary gap-2">
                  <Plus className="h-4 w-4" /> New Placement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create New Placement</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Student Name</Label>
                      <Input placeholder="Student full name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockCompanies
                            .filter((c) => c.status === "active")
                            .map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Advisor</Label>
                      <Input placeholder="Advisor name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Supervisor</Label>
                      <Input placeholder="Supervisor name" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input type="date" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="gradient-primary"
                    onClick={() => {
                      setCreateOpen(false);
                      toast.success("Placement created!");
                    }}
                  >
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {isAdvisor && (
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => navigate("/internship-advisor/oversight")}
            >
              <BookOpen className="h-4 w-4" /> Academic Oversight
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" /> Export My List
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport("pdf")}>As PDF</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("csv")}>As CSV</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={isAdvisor ? "Search your students, company, project..." : "Search placements..."}
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="pending_student_confirmation">Awaiting Confirmation</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="py-12 text-center">
            <Briefcase className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="font-medium">
              {isAdvisor ? "No placements assigned to you yet" : "No placements found"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {isAdvisor
                ? "When the coordinator assigns students to you, they will appear here."
                : "Try adjusting your search or filters."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {isAdvisor ? `${filtered.length} placement(s)` : "All placements"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="p-4 font-medium">Student</th>
                    <th className="p-4 font-medium">Company</th>
                    {isAdvisor && <th className="p-4 font-medium">Project</th>}
                    <th className="p-4 font-medium">Supervisor</th>
                    {!isAdvisor && <th className="p-4 font-medium">Advisor</th>}
                    <th className="p-4 font-medium">Period</th>
                    <th className="p-4 font-medium">Progress</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => openPlacement(p)}
                    >
                      <td className="p-4">
                        <p className="font-medium">{p.studentName}</p>
                        {isAdvisor && (
                          <p className="text-xs text-muted-foreground font-mono">{p.studentId}</p>
                        )}
                      </td>
                      <td className="p-4">{p.companyName}</td>
                      {isAdvisor && (
                        <td className="p-4 max-w-[160px]">
                          <p className="truncate" title={p.projectTitle}>
                            {p.projectTitle ?? "—"}
                          </p>
                          {p.projectStatus && (
                            <StatusBadge status={p.projectStatus} />
                          )}
                        </td>
                      )}
                      <td className="p-4">{p.supervisorName}</td>
                      {!isAdvisor && <td className="p-4">{p.advisorName}</td>}
                      <td className="p-4 text-xs whitespace-nowrap">
                        {p.startDate} — {p.endDate}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${p.progress}%` }}
                            />
                          </div>
                          <span className="text-xs">{p.progress}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            title="View details"
                            onClick={() => openPlacement(p)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {isCoordinator && (
                            <Button size="icon" variant="ghost" className="h-8 w-8" title="Edit">
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {isAdvisor && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              title="View logbooks"
                              onClick={() => navigate("/internship-advisor/logbooks")}
                            >
                              <BookOpen className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Placement Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-muted-foreground">Student</p>
                  <p className="font-medium">{selected.studentName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Company</p>
                  <p className="font-medium">{selected.companyName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Advisor</p>
                  <p className="font-medium">{selected.advisorName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Supervisor</p>
                  <p className="font-medium">{selected.supervisorName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Period</p>
                  <p className="font-medium">
                    {selected.startDate} — {selected.endDate}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <StatusBadge status={selected.status} />
                </div>
              </div>
              {selected.projectTitle && (
                <div>
                  <p className="text-muted-foreground">Project</p>
                  <p className="font-medium">{selected.projectTitle}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground mb-1">Progress</p>
                <div className="flex items-center gap-3">
                  <div className="h-3 flex-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${selected.progress}%` }}
                    />
                  </div>
                  <span className="font-medium">{selected.progress}%</span>
                </div>
              </div>
              {isAdvisor && (
                <Button className="w-full gradient-primary" onClick={() => openPlacement(selected)}>
                  Open full placement profile
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
