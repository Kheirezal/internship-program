import { useMemo, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/shared/StatusBadge";
import { mockPlacements, mockStudentDocumentSubmissions } from "@/data/mockData";
import { useAuthStore } from "@/stores/authStore";
import type {
  StudentDocumentSubmission,
  StudentSubmissionDocType,
  StudentSubmissionRecipient,
} from "@/types";
import { FileUp, Link2, Upload, User, Building2, FileArchive } from "lucide-react";
import { toast } from "sonner";

const DOC_TYPE_OPTIONS: { value: StudentSubmissionDocType; label: string }[] = [
  { value: "proposal", label: "Proposal" },
  { value: "srs", label: "SRS (System Requirements Specification)" },
  { value: "implementation", label: "Implementation" },
  { value: "other", label: "Other" },
];

const EMPTY_FORM = {
  documentType: "" as StudentSubmissionDocType | "",
  recipientRole: "" as StudentSubmissionRecipient | "",
  notes: "",
  deploymentLink: "",
  fileName: "",
  sourceZipName: "",
};

function docTypeLabel(type: StudentSubmissionDocType) {
  return DOC_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type;
}

export default function StudentSubmissionPage() {
  const { user } = useAuthStore();
  const studentId = user?.id ?? "u5";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);

  const placement = useMemo(
    () => mockPlacements.find((p) => p.studentId === studentId && p.status === "active"),
    [studentId],
  );

  const [submissions, setSubmissions] = useState<StudentDocumentSubmission[]>(() =>
    mockStudentDocumentSubmissions.filter((s) => s.studentId === studentId),
  );
  const [form, setForm] = useState(EMPTY_FORM);

  const isImplementation = form.documentType === "implementation";

  const recipientOptions = useMemo(() => {
    if (!placement) return [];
    return [
      {
        value: "company_supervisor" as const,
        label: "Company Supervisor",
        name: placement.supervisorName,
      },
      {
        value: "internship_advisor" as const,
        label: "Academic Advisor",
        name: placement.advisorName,
      },
    ];
  }, [placement]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (zipInputRef.current) zipInputRef.current.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "fileName" | "sourceZipName") => {
    const file = e.target.files?.[0];
    setForm((f) => ({ ...f, [field]: file?.name ?? "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!placement) {
      toast.error("No active placement found. Complete your placement first.");
      return;
    }
    if (!form.documentType || !form.recipientRole) {
      toast.error("Select document type and recipient.");
      return;
    }

    const recipient = recipientOptions.find((r) => r.value === form.recipientRole);
    if (!recipient) return;

    if (isImplementation) {
      if (!form.fileName && !form.deploymentLink.trim() && !form.sourceZipName) {
        toast.error("For implementation, provide at least a document, deployment link, or source zip.");
        return;
      }
    } else if (!form.fileName) {
      toast.error("Please attach a document file.");
      return;
    }

    const newSubmission: StudentDocumentSubmission = {
      id: "sub-" + Date.now(),
      studentId,
      placementId: placement.id,
      documentType: form.documentType,
      recipientRole: form.recipientRole,
      recipientName: recipient.name,
      fileName: form.fileName || undefined,
      deploymentLink: form.deploymentLink.trim() || undefined,
      sourceZipName: form.sourceZipName || undefined,
      notes: form.notes.trim() || undefined,
      status: "pending",
      submittedAt: new Date().toISOString(),
    };

    setSubmissions((prev) => [newSubmission, ...prev]);
    resetForm();
    toast.success(`Submitted to ${recipient.name}`);
  };

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileUp className="h-6 w-6 text-primary" />
          Submissions
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Send project documents to your company supervisor or academic advisor
        </p>
      </div>

      {!placement ? (
        <Card className="shadow-card border-amber-500/30 bg-amber-500/5">
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            You need an active internship placement before submitting documents.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">New submission</CardTitle>
              <CardDescription>
                Choose document type and recipient, then attach your files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Document type</Label>
                  <Select
                    value={form.documentType}
                    onValueChange={(value) =>
                      setForm((f) => ({
                        ...f,
                        documentType: value as StudentSubmissionDocType,
                        deploymentLink: "",
                        sourceZipName: "",
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {DOC_TYPE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Send to</Label>
                  <Select
                    value={form.recipientRole}
                    onValueChange={(value) =>
                      setForm((f) => ({ ...f, recipientRole: value as StudentSubmissionRecipient }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      {recipientOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label} — {opt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.recipientRole && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      {form.recipientRole === "company_supervisor" ? (
                        <Building2 className="h-3.5 w-3.5" />
                      ) : (
                        <User className="h-3.5 w-3.5" />
                      )}
                      Will be sent to{" "}
                      <span className="font-medium text-foreground">
                        {recipientOptions.find((r) => r.value === form.recipientRole)?.name}
                      </span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>{isImplementation ? "Document (optional)" : "Document"}</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.zip"
                    onChange={(e) => handleFileChange(e, "fileName")}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/30 transition-colors"
                  >
                    <Upload className="h-7 w-7 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {form.fileName || "Click to attach PDF, DOCX, or ZIP"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Max 10MB</p>
                  </button>
                </div>

                {isImplementation && (
                  <div className="space-y-4 p-4 rounded-lg border border-primary/20 bg-primary/5">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                      Implementation extras (optional)
                    </p>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1.5">
                        <Link2 className="h-3.5 w-3.5" />
                        Deployment link
                      </Label>
                      <Input
                        type="url"
                        placeholder="https://your-app.example.com"
                        value={form.deploymentLink}
                        onChange={(e) => setForm((f) => ({ ...f, deploymentLink: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1.5">
                        <FileArchive className="h-3.5 w-3.5" />
                        Source code (ZIP)
                      </Label>
                      <input
                        ref={zipInputRef}
                        type="file"
                        className="hidden"
                        accept=".zip"
                        onChange={(e) => handleFileChange(e, "sourceZipName")}
                      />
                      <button
                        type="button"
                        onClick={() => zipInputRef.current?.click()}
                        className="w-full border border-dashed rounded-lg p-4 text-center text-sm text-muted-foreground hover:bg-background/80 transition-colors"
                      >
                        {form.sourceZipName || "Attach source code .zip"}
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Notes (optional)</Label>
                  <Textarea
                    placeholder="Brief description or version notes..."
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  />
                </div>

                <Button type="submit" className="w-full gradient-primary gap-2">
                  <FileUp className="h-4 w-4" />
                  Submit document
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Submission history</CardTitle>
              <CardDescription>Track documents sent to your supervisor and advisor</CardDescription>
            </CardHeader>
            <CardContent>
              {submissions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No submissions yet.</p>
              ) : (
                <ul className="space-y-3">
                  {submissions.map((s) => (
                    <li key={s.id} className="p-3 rounded-lg border space-y-2">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-sm">{docTypeLabel(s.documentType)}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            To {s.recipientName} ·{" "}
                            {s.recipientRole === "company_supervisor"
                              ? "Company Supervisor"
                              : "Academic Advisor"}
                          </p>
                        </div>
                        <StatusBadge status={s.status} />
                      </div>
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        {s.fileName && <p>File: {s.fileName}</p>}
                        {s.deploymentLink && (
                          <p className="truncate">
                            Deploy:{" "}
                            <a
                              href={s.deploymentLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary hover:underline"
                            >
                              {s.deploymentLink}
                            </a>
                          </p>
                        )}
                        {s.sourceZipName && <p>Source: {s.sourceZipName}</p>}
                        {s.notes && <p className="italic">{s.notes}</p>}
                        <p>
                          {new Date(s.submittedAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
