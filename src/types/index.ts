export type UserRole =
  | "internship_coordinator"
  | "internship_advisor"
  | "department_head"
  | "company_supervisor"
  | "internship_student";

export type AdvisorContext = "advisor" | "evaluator";

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
  gpa?: number;
  completedCourses?: number;
  skills?: string[];
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  address: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  status: "active" | "inactive" | "pending" | "blacklisted";
  studentsCount: number;
  maxCapacity: number;
  positions?: string[];
  requiredSkills?: string[];
  duration?: string;
  qualityRating?: number;
  partnerSince?: string;
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
  evaluatorId?: string;
  evaluatorName?: string;
  startDate: string;
  endDate: string;
  status: "pending" | "pending_student_confirmation" | "active" | "completed" | "cancelled" | "rejected";
  progress: number;
  projectTitle?: string;
  projectStatus?: "pending_approval" | "approved" | "revision_requested";
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
  type: "defense" | "meeting" | "deadline" | "event" | "site_visit" | "orientation";
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
  category?: "report" | "letter" | "acceptance" | "insurance" | "agreement" | "other";
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  description: string;
  category: "grade_dispute" | "workplace" | "evaluation" | "company" | "other";
  status: "open" | "in_review" | "resolved" | "closed";
  createdAt: string;
  resolvedAt?: string;
  response?: string;
  evidence?: string[];
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
  dhApprovalStatus: "pending_coordinator" | "submitted_to_dh" | "approved" | "revision_requested" | "published";
  dhComments?: string;
  publishedAt?: string;
  submittedToDhAt?: string;
}

export interface ActivityEvent {
  id: string;
  placementId: string;
  type: string;
  description: string;
  actor: string;
  timestamp: string;
}

// ── New Types ──

export interface SiteVisit {
  id: string;
  placementId: string;
  studentId: string;
  studentName: string;
  companyName: string;
  advisorId: string;
  advisorName: string;
  supervisorId: string;
  supervisorName: string;
  scheduledDate: string;
  scheduledTime: string;
  status: "scheduled" | "completed" | "cancelled" | "rescheduled";
  notes?: string;
  findings?: string;
  workEnvironmentRating?: number;
  taskRelevanceRating?: number;
}

export interface InternshipApplication {
  id: string;
  studentId: string;
  studentName: string;
  companyName: string;
  companyContact: string;
  companyEmail: string;
  companyAddress: string;
  proposedRole: string;
  isSelfFound: boolean;
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected";
  coordinatorNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  targetRoles: UserRole[];
  priority: "normal" | "important" | "urgent";
  createdAt: string;
  expiresAt?: string;
  isRead?: boolean;
}

export interface Recommendation {
  id: string;
  studentId: string;
  studentName: string;
  supervisorId: string;
  supervisorName: string;
  type: "completion" | "employment";
  rating: number;
  strengths: string;
  improvements: string;
  comments: string;
  submittedAt: string;
}

export interface RubricConfig {
  id: string;
  name: string;
  criteria: { name: string; maxScore: number; description: string }[];
  weights: { supervisor: number; advisor: number; evaluator: number };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrientationSession {
  id: string;
  title: string;
  description: string;
  topic: "professional_ethics" | "workplace_behavior" | "nda" | "industry_expectations" | "general";
  date: string;
  time: string;
  duration: string;
  location: string;
  presenter: string;
  status: "scheduled" | "completed" | "cancelled";
  attendees: string[];
  materials?: string[];
}

export interface GapAnalysis {
  id: string;
  skillArea: string;
  occurrenceCount: number;
  severity: "low" | "medium" | "high";
  suggestedAction: string;
  relatedCourses?: string[];
  identifiedAt: string;
}

// ── Exam System Types ──

export interface ExamQuestion {
  id: string;
  courseId: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  type: "MCQ" | "TrueFalse";
  text: string;
  options: string[]; 
  correctAnswer: string;
}

export interface Exam {
  id: string;
  title: string;
  courses: string[]; 
  status: "Draft" | "Scheduled" | "Active" | "Completed";
  passwordSet: boolean; 
  scheduledStart?: string; 
  scheduledEnd?: string; 
  durationMinutes: number;
  totalQuestions: number;
  questions: ExamQuestion[];
  createdAt: string;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  department: string;
  answers: Record<string, string>; 
  score: number;
  totalScore: number;
  percentage: number;
  submittedAt: string;
  isAutoSubmitted: boolean;
}

// ── Permissions ──

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
  | "view_analytics"
  | "import_students"
  | "manage_users"
  | "approve_eligibility"
  | "approve_grades"
  | "publish_results"
  | "manage_announcements"
  | "manage_orientation"
  | "manage_site_visits"
  | "conduct_site_visits"
  | "submit_recommendation"
  | "apply_internship"
  | "configure_rubric"
  | "view_defense"
  | "manage_exams"
  | "take_exams";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  internship_coordinator: [
    "manage_companies", "manage_placements", "manage_evaluations",
    "manage_complaints", "manage_calendar", "send_messages", "view_analytics",
    "view_grades", "manage_site_visits", "configure_rubric", "manage_users",
  ],
  internship_advisor: [
    "review_logbooks", "evaluate_internship", "send_messages",
    "view_analytics", "manage_calendar", "view_grades",
    "conduct_site_visits", "view_defense",
  ],
  department_head: [
    "import_students", "manage_users", "approve_eligibility",
    "view_analytics", "send_messages", "view_grades",
    "approve_grades", "publish_results", "manage_announcements",
    "manage_orientation", "manage_companies", "manage_exams",
  ],
  company_supervisor: [
    "record_attendance", "assign_tasks", "evaluate_internship",
    "send_messages", "submit_recommendation",
  ],
  internship_student: [
    "submit_logbook", "submit_report", "view_grades", "send_messages",
    "manage_complaints", "apply_internship", "take_exams",
  ],
};

export const ROLE_LABELS: Record<UserRole, string> = {
  internship_coordinator: "Coordinator",
  internship_advisor: "Academic Advisor",
  department_head: "Department Head",
  company_supervisor: "Company Supervisor",
  internship_student: "Student",
};
