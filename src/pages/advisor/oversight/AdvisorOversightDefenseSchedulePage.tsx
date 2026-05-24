import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import DefensePage from "@/pages/shared/DefensePage";

export default function AdvisorOversightDefenseSchedulePage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        className="gap-1 -ml-2 text-muted-foreground"
        onClick={() => navigate("/internship-advisor/oversight/defense")}
      >
        <ChevronLeft className="h-4 w-4" /> Back to Defense Readiness
      </Button>
      <DefensePage />
    </div>
  );
}
