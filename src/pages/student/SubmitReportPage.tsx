import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { toast } from "sonner";

export default function SubmitReportPage() {
  return (
    <div className="space-y-6 animate-in max-w-2xl">
      <div><h1 className="text-2xl font-bold">Submit Report</h1><p className="text-muted-foreground text-sm">Upload your internship report</p></div>
      <Card className="shadow-card">
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2"><Label>Report Title</Label><Input placeholder="Final Internship Report" /></div>
          <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Brief description..." rows={3} /></div>
          <div className="space-y-2">
            <Label>File</Label>
            <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/30 transition-colors">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
              <p className="text-xs text-muted-foreground">PDF, DOCX up to 10MB</p>
            </div>
          </div>
          <Button className="w-full gradient-primary" onClick={() => toast.success("Report submitted!")}>Submit Report</Button>
        </CardContent>
      </Card>
    </div>
  );
}
