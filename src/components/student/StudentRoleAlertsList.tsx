import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROLE_LABELS, type StudentRoleAlert } from "@/types";
import {
  AlertCircle,
  Briefcase,
  Building2,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ROLE_STYLES: Record<
  StudentRoleAlert["fromRole"],
  { badge: string; icon: string; Icon: typeof GraduationCap }
> = {
  internship_advisor: {
    badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    icon: "text-emerald-600",
    Icon: GraduationCap,
  },
  internship_coordinator: {
    badge: "bg-primary/10 text-primary border-primary/20",
    icon: "text-primary",
    Icon: Building2,
  },
  company_supervisor: {
    badge: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    icon: "text-amber-600",
    Icon: Briefcase,
  },
};

function formatDueDate(isoDate: string) {
  return new Date(isoDate + "T12:00:00").toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDueUrgency(dueDate: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + "T12:00:00");
  const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { label: "Overdue", className: "text-destructive bg-destructive/10 border-destructive/20" };
  if (diffDays <= 2) return { label: "Due soon", className: "text-warning bg-warning/10 border-warning/20" };
  return { label: "Upcoming", className: "text-muted-foreground bg-muted/50 border-border" };
}

interface StudentRoleAlertsListProps {
  alerts: StudentRoleAlert[];
  className?: string;
}

export default function StudentRoleAlertsList({ alerts, className }: StudentRoleAlertsListProps) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [alerts]);

  if (alerts.length === 0) {
    return (
      <p className={cn("text-sm text-muted-foreground text-center py-8", className)}>
        No pending announcements from your internship team.
      </p>
    );
  }

  const alert = alerts[index];
  const styles = ROLE_STYLES[alert.fromRole];
  const { Icon } = styles;
  const urgency = getDueUrgency(alert.dueDate);
  const isFirst = index === 0;
  const isLast = index === alerts.length - 1;

  const goNext = () => setIndex((i) => Math.min(i + 1, alerts.length - 1));
  const goPrev = () => setIndex((i) => Math.max(i - 1, 0));

  return (
    <div className={cn("flex flex-col min-h-[200px]", className)}>
      <div className="flex items-center justify-between gap-2 mb-4">
        <span className="text-xs text-muted-foreground tabular-nums">
          {index + 1} of {alerts.length}
        </span>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={goPrev}
            disabled={isFirst}
            aria-label="Previous announcement"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={goNext}
            disabled={isLast}
            aria-label="Next announcement"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <article
        key={alert.id}
        className={cn(
          "flex-1 rounded-lg border p-4 animate-in fade-in duration-200",
          alert.priority === "urgent" && "border-destructive/30 bg-destructive/5",
          alert.priority === "important" && "border-warning/30 bg-warning/5",
          alert.priority === "normal" && "bg-muted/20",
        )}
      >
        <div className="flex gap-3">
          <div
            className={cn(
              "h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-muted/80",
              styles.icon,
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="outline" className={cn("text-[10px] font-semibold", styles.badge)}>
                {ROLE_LABELS[alert.fromRole]}
              </Badge>
              {alert.priority === "urgent" && (
                <Badge variant="outline" className="text-[10px] border-destructive/30 text-destructive">
                  Urgent
                </Badge>
              )}
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ml-auto",
                  urgency.className,
                )}
              >
                {urgency.label === "Overdue" && <AlertCircle className="h-3 w-3" />}
                {urgency.label}
              </span>
            </div>

            <h4 className="text-sm font-semibold leading-snug">{alert.title}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{alert.message}</p>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t">
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground">From {alert.fromName}</p>
                <p className="inline-flex items-center gap-1 text-xs font-semibold">
                  <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />
                  Due {formatDueDate(alert.dueDate)}
                </p>
              </div>
              {alert.link && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs shrink-0"
                  onClick={() => navigate(alert.link!)}
                >
                  Open task
                  <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </article>

      {alerts.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {alerts.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50",
              )}
              aria-label={`Go to announcement ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
