import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import StudentDocumentSubmissionsPage from "@/pages/shared/StudentDocumentSubmissionsPage";

export default function AdvisorOversightSubmissionsPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        className="gap-1 -ml-2 text-muted-foreground"
        onClick={() => navigate("/internship-advisor/oversight/final-docs")}
      >
        <ChevronLeft className="h-4 w-4" /> Back to Final Reports
      </Button>
      <StudentDocumentSubmissionsPage />
    </div>
  );
}
