import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import MessagesPage from "@/pages/shared/MessagesPage";

export default function AdvisorOversightMessagesPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        className="gap-1 -ml-2 text-muted-foreground"
        onClick={() => navigate("/internship-advisor/oversight/guidance")}
      >
        <ChevronLeft className="h-4 w-4" /> Back to Research Guidance
      </Button>
      <MessagesPage />
    </div>
  );
}
