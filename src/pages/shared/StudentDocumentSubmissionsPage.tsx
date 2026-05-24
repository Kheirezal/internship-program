import { useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/shared/StatusBadge";
import { mockPlacements, mockStudentDocumentSubmissions } from "@/data/mockData";
import { useAuthStore } from "@/stores/authStore";
import type {
  StudentDocumentSubmission,
  StudentSubmissionDocType,
  StudentSubmissionRecipient,
} from "@/types";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  RotateCcw,
  FileUp,
  Link2,
  FileArchive,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const DOC_TYPE_LABELS: Record<StudentSubmissionDocType, string> = {
  proposal: "Proposal",
  srs: "SRS",
  implementation: "Implementation",
  other: "Other",
};

function docTypeLabel(type: StudentSubmissionDocType) {
  return DOC_TYPE_LABELS[type] ?? type;
}

function studentNameFor(sub: StudentDocumentSubmission) {
  return (
    sub.studentName ??
    mockPlacements.find((p) => p.id === sub.placementId)?.studentName ??
    "Unknown student"
  );
}

export default function StudentDocumentSubmissionsPage() {
  const { user } = useAuthStore();
  const location = useLocation();

  const isAdvisor = user?.role === "internship_advisor";
  const isAllowed =
    user?.role === "internship_advisor" || user?.role === "company_supervisor";
  const recipientRole: StudentSubmissionRecipient = isAdvisor
    ? "internship_advisor"
    : "company_supervisor";

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [docTypeFilter, setDocTypeFilter] = useState("all");
  const [submissions, setSubmissions] = useState(mockStudentDocumentSubmissions);
  const [viewOpen, setViewOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selected, setSelected] = useState<StudentDocumentSubmission | null>(null);
  const [feedback, setFeedback] = useState("");
  const [reviewAction, setReviewAction] = useState<
    "approved" | "rejected" | "revision_requested"
  >("approved");

  const myPlacementIds = useMemo(() => {
    if (!user) return new Set<string>();
    return new Set(
      mockPlacements
        .filter((p) =>
          isAdvisor ? p.advisorId === user.id : p.supervisorId === user.id,
        )
        .map((p) => p.id),
    );
  }, [user, isAdvisor]);

  const roleSubmissions = useMemo(
    () =>
      submissions.filter(
        (s) =>
          s.recipientRole === recipientRole && myPlacementIds.has(s.placementId),
      ),
    [submissions, recipientRole, myPlacementIds],
  );

  const filtered = roleSubmissions
    .filter((s) => {
      const name = studentNameFor(s).toLowerCase();
      const q = search.toLowerCase();
      return (
        name.includes(q) ||
        docTypeLabel(s.documentType).toLowerCase().includes(q) ||
        (s.fileName?.toLowerCase().includes(q) ?? false)
      );
    })
    .filter((s) => statusFilter === "all" || s.status === statusFilter)
    .filter((s) => docTypeFilter === "all" || s.documentType === docTypeFilter);

  const pendingCount = roleSubmissions.filter((s) => s.status === "pending").length;

  const updateStatus = (
    id: string,
    status: StudentDocumentSubmission["status"],
  ) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s)),
    );
    setReviewOpen(false);
    setViewOpen(false);
    setFeedback("");
    const labels = {
      approved: "approved",
      rejected: "rejected",
      revision_requested: "marked for revision",
    };
    toast.success(`Submission ${labels[status]}`);
  };

  const handleReview = () => {
    if (!selected) return;
    updateStatus(selected.id, reviewAction);
  };

  const openReview = (
    sub: StudentDocumentSubmission,
    action: typeof reviewAction,
  ) => {
    setSelected(sub);
    setReviewAction(action);
    setReviewOpen(true);
  };

  const pageTitle = isAdvisor ? "Student Submissions" : "Intern Submissions";
  const pageDescription = isAdvisor
    ? "Review proposal, SRS, implementation, and other documents sent to you by students"
    : "Review documents submitted by your interns";

  if (!isAllowed) {
    return (
      <Navigate
        to={user ? `/${user.role.replace(/_/g, "-")}` : "/login"}
        replace
      />
    );
  }

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileUp className="h-6 w-6 text-primary" />
          {pageTitle}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">{pageDescription}</p>
        {pendingCount > 0 && (
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
            {pendingCount} submission{pendingCount !== 1 ? "s" : ""} awaiting your
            review
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by student or document..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={docTypeFilter} onValueChange={setDocTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Document type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {(Object.keys(DOC_TYPE_LABELS) as StudentSubmissionDocType[]).map(
              (t) => (
                <SelectItem key={t} value={t}>
                  {DOC_TYPE_LABELS[t]}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="revision_requested">Revision requested</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="p-4 font-medium">Student</th>
                  <th className="p-4 font-medium">Document</th>
                  <th className="p-4 font-medium">Submitted</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-muted-foreground"
                    >
                      No submissions found
                      {location.pathname.includes("submissions")
                        ? " for your assigned students"
                        : ""}
                      .
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4 font-medium">{studentNameFor(s)}</td>
                      <td className="p-4">
                        <p>{docTypeLabel(s.documentType)}</p>
                        {s.fileName && (
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {s.fileName}
                          </p>
                        )}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(s.submittedAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-4">
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => {
                              setSelected(s);
                              setViewOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {s.status === "pending" && (
                            <>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-success"
                                title="Approve"
                                onClick={() => openReview(s, "approved")}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-amber-600"
                                title="Request revision"
                                onClick={() =>
                                  openReview(s, "revision_requested")
                                }
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-destructive"
                                title="Reject"
                                onClick={() => openReview(s, "rejected")}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selected ? docTypeLabel(selected.documentType) : "Submission"}
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-muted-foreground">Student</p>
                  <p className="font-medium">{studentNameFor(selected)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <StatusBadge status={selected.status} />
                </div>
                <div>
                  <p className="text-muted-foreground">Submitted</p>
                  <p className="font-medium">
                    {new Date(selected.submittedAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-medium">{docTypeLabel(selected.documentType)}</p>
                </div>
              </div>

              {selected.fileName && (
                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <span className="truncate">{selected.fileName}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 shrink-0"
                    onClick={() => toast.info("Download would open in production")}
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </Button>
                </div>
              )}

              {selected.deploymentLink && (
                <p className="flex items-start gap-2">
                  <Link2 className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                  <a
                    href={selected.deploymentLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline break-all"
                  >
                    {selected.deploymentLink}
                  </a>
                </p>
              )}

              {selected.sourceZipName && (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <FileArchive className="h-4 w-4" />
                  {selected.sourceZipName}
                </p>
              )}

              {selected.notes && (
                <div>
                  <p className="text-muted-foreground mb-1">Student notes</p>
                  <p className="p-3 rounded-lg bg-muted/50">{selected.notes}</p>
                </div>
              )}

              {selected.status === "pending" && (
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    variant="outline"
                    onClick={() => openReview(selected, "revision_requested")}
                  >
                    Request revision
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => openReview(selected, "rejected")}
                  >
                    Reject
                  </Button>
                  <Button onClick={() => openReview(selected, "approved")}>
                    Approve
                  </Button>
                </DialogFooter>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === "approved"
                ? "Approve submission"
                : reviewAction === "rejected"
                  ? "Reject submission"
                  : "Request revision"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {selected && (
                <>
                  <strong>{docTypeLabel(selected.documentType)}</strong> from{" "}
                  <strong>{studentNameFor(selected)}</strong>
                </>
              )}
            </p>
            <div className="space-y-2">
              <Label>Feedback (optional)</Label>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Comments for the student..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={reviewAction === "rejected" ? "destructive" : "default"}
              onClick={handleReview}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
