import { useEffect, useMemo } from "react";
import { NavLink, Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FileText,
  GraduationCap,
  CalendarClock,
  BookMarked,
  Target,
  Lightbulb,
  MessageSquare,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  mockAdvisorProgressReports,
  mockAcademicRelevanceReviews,
  mockAdvisorFollowUps,
  mockFinalReportReviews,
  mockDefenseReadinessReviews,
} from "@/data/mockData";
import { useAdvisorScope } from "./useAdvisorScope";

const NAV_ITEMS = [
  { path: "progress", label: "Progress Reports", icon: FileText },
  { path: "relevance", label: "Academic Relevance", icon: GraduationCap },
  { path: "followup", label: "Follow-ups", icon: CalendarClock },
  { path: "final-docs", label: "Final Reports", icon: BookMarked },
  { path: "defense", label: "Defense Readiness", icon: Target },
  { path: "guidance", label: "Research Guidance", icon: Lightbulb },
] as const;

const LEGACY_TABS = ["progress", "relevance", "followup", "final-docs", "defense", "guidance"];

export default function AdvisorOversightLayout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { myPlacementIds } = useAdvisorScope();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && LEGACY_TABS.includes(tab)) {
      navigate(`/internship-advisor/oversight/${tab}`, { replace: true });
    }
  }, [searchParams, navigate]);

  const pendingCounts = useMemo(() => {
    return {
      progress: mockAdvisorProgressReports.filter(
        (r) => myPlacementIds.includes(r.placementId) && r.status === "pending_review"
      ).length,
      relevance: mockAcademicRelevanceReviews.filter(
        (r) => myPlacementIds.includes(r.placementId) && r.curriculumAlignment === "pending"
      ).length,
      followup: mockAdvisorFollowUps.filter(
        (f) => myPlacementIds.includes(f.placementId) && f.status === "scheduled"
      ).length,
      "final-docs": mockFinalReportReviews.filter(
        (f) => myPlacementIds.includes(f.placementId) && f.status === "pending"
      ).length,
      defense: mockDefenseReadinessReviews.filter(
        (d) => myPlacementIds.includes(d.placementId) && d.status !== "ready"
      ).length,
      guidance: 0,
    };
  }, [myPlacementIds]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2 -ml-2 gap-1 text-muted-foreground"
            onClick={() => navigate("/internship-advisor")}
          >
            <ChevronLeft className="h-4 w-4" /> Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Academic Oversight</h1>
          <p className="text-muted-foreground text-sm">
            Progress reports, relevance monitoring, follow-ups, final documentation, defense readiness, and research guidance
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2 shrink-0"
          onClick={() => navigate("/internship-advisor/oversight/messages")}
        >
          <MessageSquare className="h-4 w-4" /> Message Students
        </Button>
      </div>

      <nav className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {NAV_ITEMS.map((item) => {
          const count = pendingCounts[item.path];
          return (
            <NavLink
              key={item.path}
              to={`/internship-advisor/oversight/${item.path}`}
              className={({ isActive }) =>
                cn(
                  "p-3 rounded-lg border text-left transition-all hover:shadow-md",
                  isActive ? "border-primary bg-primary/5 shadow-sm" : "bg-card"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn(
                      "h-4 w-4 mb-2",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <p className="text-xs font-semibold leading-tight">{item.label}</p>
                  {count > 0 && (
                    <span className="text-[10px] font-bold text-primary mt-1 inline-block">
                      {count} pending
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <Outlet />
    </div>
  );
}
