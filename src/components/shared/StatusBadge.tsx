import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType = string;

const STATUS_STYLES: Record<string, string> = {
  active: "bg-success/10 text-success border-success/20",
  present: "bg-success/10 text-success border-success/20",
  approved: "bg-success/10 text-success border-success/20",
  completed: "bg-success/10 text-success border-success/20",
  published: "bg-success/10 text-success border-success/20",
  finalized: "bg-success/10 text-success border-success/20",
  resolved: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  submitted: "bg-info/10 text-info border-info/20",
  in_progress: "bg-info/10 text-info border-info/20",
  in_review: "bg-info/10 text-info border-info/20",
  revision_requested: "bg-warning/10 text-warning border-warning/20",
  reviewed: "bg-primary/10 text-primary border-primary/20",
  draft: "bg-muted text-muted-foreground border-muted",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  inactive: "bg-muted text-muted-foreground border-muted",
  absent: "bg-destructive/10 text-destructive border-destructive/20",
  late: "bg-warning/10 text-warning border-warning/20",
  excused: "bg-muted text-muted-foreground border-muted",
  open: "bg-warning/10 text-warning border-warning/20",
  closed: "bg-muted text-muted-foreground border-muted",
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-success/10 text-success border-success/20",
  defense: "bg-primary/10 text-primary border-primary/20",
};

export default function StatusBadge({ status, className }: { status: StatusType; className?: string }) {
  const style = STATUS_STYLES[status] || "bg-muted text-muted-foreground";
  return (
    <Badge variant="outline" className={cn("capitalize font-medium", style, className)}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
