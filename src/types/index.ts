export type UserRole =
  | "internship_coordinator"
  | "internship_advisor"
  | "internship_evaluator"
  | "company_supervisor"
  | "internship_student";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  phone?: string;
  theme?: "light" | "dark";
  colorTheme?: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  address: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  status: "active" | "inactive" | "pending";
  studentsCount: number;
}

export interface Placement {
  id: string;
  studentId: string;
  studentName: string;
  companyId: string;
  companyName: string;
  advisorId: string;
  advisorName: string;
  supervisorId: string;
  supervisorName: string;
  startDate: string;
  endDate: string;
  status: "pending" | "active" | "completed" | "cancelled";
  progress: number;
}

export interface Logbook {
  id: string;
  studentId: string;
  studentName: string;
  placementId: string;
  date: string;
  title: string;
  content: string;
  status: "draft" | "submitted" | "reviewed" | "approved" | "rejected";
  feedback?: string;
  reviewedBy?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  placementId: string;
  dueDate: string;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
}

export interface Attendance {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: "present" | "absent" | "late" | "excused";
  notes?: string;
}

export interface Evaluation {
  id: string;
  placementId: string;
  studentName: string;
  evaluatorId: string;
  evaluatorName: string;
  evaluatorRole: "advisor" | "evaluator" | "supervisor";
  score: number;
  weight: number;
  criteria: { name: string; score: number; maxScore: number }[];
  comments: string;
  status: "draft" | "submitted" | "finalized";
  date: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  subject: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: "defense" | "meeting" | "deadline" | "event";
  participants: string[];
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  placementId?: string;
  status: "pending" | "approved" | "rejected";
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  description: string;
  status: "open" | "in_review" | "resolved" | "closed";
  createdAt: string;
  resolvedAt?: string;
  response?: string;
}

export interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  placementId: string;
  supervisorScore: number;
  advisorScore: number;
  evaluatorScore: number;
  finalGrade: number;
  letterGrade: string;
  status: "pending" | "published";
}

export interface ActivityEvent {
  id: string;
  placementId: string;
  type: string;
  description: string;
  actor: string;
  timestamp: string;
}

export type Permission =
  | "manage_companies"
  | "manage_placements"
  | "review_logbooks"
  | "evaluate_internship"
  | "record_attendance"
  | "submit_logbook"
  | "submit_report"
  | "view_grades"
  | "manage_evaluations"
  | "manage_complaints"
  | "assign_tasks"
  | "manage_calendar"
  | "send_messages"
  | "view_analytics";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  internship_coordinator: [
    "manage_companies", "manage_placements", "manage_evaluations",
    "manage_complaints", "manage_calendar", "send_messages", "view_analytics",
    "view_grades",
  ],
  internship_advisor: [
    "review_logbooks", "evaluate_internship", "send_messages",
    "view_analytics", "manage_calendar", "view_grades",
  ],
  internship_evaluator: [
    "evaluate_internship", "manage_evaluations", "send_messages",
    "manage_calendar", "view_grades",
  ],
  company_supervisor: [
    "record_attendance", "assign_tasks", "evaluate_internship",
    "send_messages",
  ],
  internship_student: [
    "submit_logbook", "submit_report", "view_grades", "send_messages",
    "manage_complaints",
  ],
};

export const ROLE_LABELS: Record<UserRole, string> = {
  internship_coordinator: "Coordinator",
  internship_advisor: "Academic Advisor",
  internship_evaluator: "Evaluator",
  company_supervisor: "Company Supervisor",
  internship_student: "Student",
};
