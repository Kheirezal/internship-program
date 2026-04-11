import { useNotificationStore } from "@/stores/notificationStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, CheckCheck, Trash2, BookOpen, ClipboardList, Star, Calendar, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const TYPE_ICONS: Record<string, React.ElementType> = {
  logbook: BookOpen,
  evaluation: Star,
  attendance: ClipboardList,
  defense: Calendar,
  message: MessageSquare,
};

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();
  const [typeFilter, setTypeFilter] = useState("all");
  const [readFilter, setReadFilter] = useState("all");

  const filtered = notifications
    .filter(n => typeFilter === "all" || n.type === typeFilter)
    .filter(n => readFilter === "all" || (readFilter === "unread" ? !n.read : n.read));

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Notifications</h1><p className="text-muted-foreground text-sm">Stay up to date</p></div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => { markAllAsRead(); toast.success("All marked as read"); }}><CheckCheck className="h-4 w-4" /> Mark all read</Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="logbook">Logbook</SelectItem>
            <SelectItem value="evaluation">Evaluation</SelectItem>
            <SelectItem value="attendance">Attendance</SelectItem>
            <SelectItem value="defense">Defense</SelectItem>
            <SelectItem value="message">Message</SelectItem>
          </SelectContent>
        </Select>
        <Select value={readFilter} onValueChange={setReadFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="read">Read</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <Card className="shadow-card"><CardContent className="p-8 text-center text-muted-foreground">No notifications found.</CardContent></Card>
        )}
        {filtered.map((n) => {
          const Icon = TYPE_ICONS[n.type] || Bell;
          return (
            <Card key={n.id} className={`shadow-card cursor-pointer transition-all hover:shadow-elevated ${!n.read ? "border-primary/30 bg-accent/20" : ""}`} onClick={() => markAsRead(n.id)}>
              <CardContent className="p-4 flex items-start gap-3">
                <div className={`h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 ${!n.read ? "bg-primary/10" : "bg-muted"}`}>
                  <Icon className={`h-4 w-4 ${!n.read ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{n.title}</p>
                    {!n.read && <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />}
                  </div>
                  <p className="text-sm text-muted-foreground">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
