import { create } from "zustand";
import type { Notification, User } from "@/types";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Omit<Notification, "id" | "createdAt">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  generateAutoNotifications: (user: User | null) => void;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1", userId: "u1", type: "logbook_submitted", title: "New Logbook", message: "Alex Johnson submitted a logbook entry.", read: false, createdAt: new Date().toISOString(), link: "/internship-advisor/logbooks" },
  { id: "n2", userId: "u1", type: "report_uploaded", title: "Report Uploaded", message: "A new internship report has been uploaded.", read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "n3", userId: "u1", type: "complaint_created", title: "New Complaint", message: "A student filed a grade complaint.", read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "n4", userId: "u1", type: "evaluation_submitted", title: "Evaluation Ready", message: "Company supervisor submitted evaluation.", read: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: "n5", userId: "u1", type: "defense_scheduled", title: "Defense Scheduled", message: "Defense for Alex Johnson scheduled for next week.", read: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
];

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: MOCK_NOTIFICATIONS,
  unreadCount: MOCK_NOTIFICATIONS.filter((n) => !n.read).length,
  addNotification: (n) =>
    set((state) => {
      const notification: Notification = { ...n, id: "n" + Date.now(), createdAt: new Date().toISOString() };
      return { notifications: [notification, ...state.notifications], unreadCount: state.unreadCount + (n.read ? 0 : 1) };
    }),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
      unreadCount: Math.max(0, state.unreadCount - (state.notifications.find((n) => n.id === id && !n.read) ? 1 : 0)),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
   clearAll: () => set({ notifications: [], unreadCount: 0 }),
   generateAutoNotifications: (user) => {
     if (!user) return;
     const newNotifications: Omit<Notification, "id" | "createdAt">[] = [];

     // Coordinator Checks
     if (user.role === "internship_coordinator") {
       newNotifications.push({
         userId: user.id,
         type: "system_alert",
         title: "Program Risk Alert",
         message: "3 students have missing logbooks for this week.",
         read: false,
         link: "/internship-coordinator/reports"
       });
     }

     // Advisor Checks
     if (user.role === "internship_advisor") {
       newNotifications.push({
         userId: user.id,
         type: "logbook_submitted",
         title: "Pending Reviews",
         message: "You have 4 logbooks waiting for your approval.",
         read: false,
         link: "/internship-advisor/logbooks"
       });
     }

     // Student Checks
     if (user.role === "internship_student") {
       newNotifications.push({
         userId: user.id,
         type: "task_assigned",
         title: "Weekly Task",
         message: "Don't forget to submit your weekly logbook today.",
         read: false,
         link: "/internship-student/logbooks"
       });
     }

     if (newNotifications.length > 0) {
       set((state) => {
         const added = newNotifications.map((n, i) => ({
           ...n,
           id: "auto-" + Date.now() + i,
           createdAt: new Date().toISOString()
         }));
         const filtered = added.filter(an => !state.notifications.some(on => on.message === an.message));
         return {
           notifications: [...filtered, ...state.notifications],
           unreadCount: state.unreadCount + filtered.length
         };
       });
     }
   }
 }));
