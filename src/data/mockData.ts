import type { Company, Placement, Logbook, Task, Attendance, Evaluation, Message, Grade, Complaint, CalendarEvent, Document, ActivityEvent } from "@/types";

export const mockCompanies: Company[] = [
  { id: "c1", name: "TechCorp Solutions", industry: "Technology", address: "123 Silicon Ave", contactPerson: "John Smith", contactEmail: "john@techcorp.com", contactPhone: "+1-555-0101", status: "active", studentsCount: 8, maxCapacity: 10, positions: ["Frontend Developer", "Backend Engineer"], requiredSkills: ["React", "Node.js", "TypeScript"], duration: "4 Months" },
  { id: "c2", name: "DataFlow Inc", industry: "Data Analytics", address: "456 Data Lane", contactPerson: "Jane Doe", contactEmail: "jane@dataflow.com", contactPhone: "+1-555-0102", status: "active", studentsCount: 5, maxCapacity: 6, positions: ["Data Analyst", "Python Developer"], requiredSkills: ["Python", "SQL", "Pandas"], duration: "4 Months" },
  { id: "c3", name: "CloudNine Systems", industry: "Cloud Computing", address: "789 Cloud Blvd", contactPerson: "Bob Wilson", contactEmail: "bob@cloudnine.com", contactPhone: "+1-555-0103", status: "pending", studentsCount: 0, maxCapacity: 8, positions: ["DevOps Intern"], requiredSkills: ["AWS", "Docker", "Linux"], duration: "6 Months" },
  { id: "c4", name: "GreenTech Energy", industry: "Renewable Energy", address: "321 Green St", contactPerson: "Lisa Green", contactEmail: "lisa@greentech.com", contactPhone: "+1-555-0104", status: "active", studentsCount: 3, maxCapacity: 5, positions: ["Systems Engineer"], requiredSkills: ["C++", "Embedded Systems"], duration: "3 Months" },
  { id: "c5", name: "MedTech Labs", industry: "Healthcare", address: "654 Health Rd", contactPerson: "Dr. Park", contactEmail: "park@medtech.com", contactPhone: "+1-555-0105", status: "inactive", studentsCount: 0, maxCapacity: 4, positions: ["QA Tester"], requiredSkills: ["Selenium", "Java"], duration: "4 Months" },
];

export const mockPlacements: Placement[] = [
  { id: "p1", studentId: "u5", studentName: "Alex Johnson", companyId: "c1", companyName: "TechCorp Solutions", advisorId: "u2", advisorName: "Prof. James Wilson", supervisorId: "u4", supervisorName: "Michael Brown", startDate: "2025-01-15", endDate: "2025-06-15", status: "active", progress: 65, projectTitle: "Internal HR Management System API", projectStatus: "approved" },
  { id: "p2", studentId: "s2", studentName: "Emily Davis", companyId: "c2", companyName: "DataFlow Inc", advisorId: "u2", advisorName: "Prof. James Wilson", supervisorId: "s6", supervisorName: "Sarah Lee", startDate: "2025-02-01", endDate: "2025-07-01", status: "active", progress: 45, projectTitle: "Customer Segmentation using K-Means", projectStatus: "pending_approval" },
  { id: "p3", studentId: "s3", studentName: "Ryan Martinez", companyId: "c1", companyName: "TechCorp Solutions", advisorId: "u2", advisorName: "Prof. James Wilson", supervisorId: "u4", supervisorName: "Michael Brown", startDate: "2025-01-15", endDate: "2025-06-15", status: "pending_student_confirmation", progress: 0 },
  { id: "p4", studentId: "s4", studentName: "Sophie Chen", companyId: "c4", companyName: "GreenTech Energy", advisorId: "a2", advisorName: "Dr. Emma Taylor", supervisorId: "s7", supervisorName: "Tom Green", startDate: "2024-09-01", endDate: "2025-02-01", status: "completed", progress: 100, projectTitle: "Solar Inverter Efficiency Monitoring", projectStatus: "approved" },
];

export const mockLogbooks: Logbook[] = [
  { id: "l1", studentId: "u5", studentName: "Alex Johnson", placementId: "p1", date: "2025-04-07", title: "API Integration Work", content: "Implemented REST API endpoints for user management module. Learned about middleware patterns.", status: "submitted" },
  { id: "l2", studentId: "u5", studentName: "Alex Johnson", placementId: "p1", date: "2025-04-06", title: "Database Design", content: "Designed database schema for the new feature. Created ER diagrams.", status: "approved", feedback: "Great work on the ER diagrams!", reviewedBy: "Prof. James Wilson" },
  { id: "l3", studentId: "s2", studentName: "Emily Davis", placementId: "p2", date: "2025-04-07", title: "Data Pipeline Setup", content: "Set up ETL pipeline using Python and Apache Airflow.", status: "submitted" },
  { id: "l4", studentId: "s3", studentName: "Ryan Martinez", placementId: "p3", date: "2025-04-07", title: "Frontend Development", content: "Built responsive dashboard components using React and Tailwind CSS.", status: "reviewed", feedback: "Good progress, add more detail about challenges." },
];

export const mockTasks: Task[] = [
  { id: "t1", title: "Complete API Documentation", description: "Document all REST endpoints", assignedTo: "u5", assignedBy: "u4", placementId: "p1", dueDate: "2025-04-15", status: "in_progress", priority: "high" },
  { id: "t2", title: "Unit Testing", description: "Write unit tests for auth module", assignedTo: "u5", assignedBy: "u4", placementId: "p1", dueDate: "2025-04-20", status: "pending", priority: "medium" },
  { id: "t3", title: "UI Mockups", description: "Create mockups for settings page", assignedTo: "s2", assignedBy: "s6", placementId: "p2", dueDate: "2025-04-18", status: "completed", priority: "low" },
];

export const mockAttendance: Attendance[] = [
  { id: "a1", studentId: "u5", studentName: "Alex Johnson", date: "2025-04-09", checkIn: "08:30", checkOut: "17:00", status: "present" },
  { id: "a2", studentId: "u5", studentName: "Alex Johnson", date: "2025-04-08", checkIn: "09:15", checkOut: "17:30", status: "late", notes: "Traffic delay" },
  { id: "a3", studentId: "u5", studentName: "Alex Johnson", date: "2025-04-07", checkIn: "08:00", checkOut: "16:30", status: "present" },
  { id: "a4", studentId: "s2", studentName: "Emily Davis", date: "2025-04-09", checkIn: "08:45", checkOut: "17:00", status: "present" },
];

export const mockEvaluations: Evaluation[] = [
  { id: "e1", placementId: "p1", studentName: "Alex Johnson", evaluatorId: "u4", evaluatorName: "Michael Brown", evaluatorRole: "supervisor", score: 82, weight: 30, criteria: [{ name: "Technical Skills", score: 85, maxScore: 100 }, { name: "Communication", score: 78, maxScore: 100 }, { name: "Teamwork", score: 83, maxScore: 100 }], comments: "Strong technical abilities, good team player.", status: "submitted", date: "2025-04-01" },
  { id: "e2", placementId: "p4", studentName: "Sophie Chen", evaluatorId: "a2", evaluatorName: "Dr. Emma Taylor", evaluatorRole: "advisor", score: 90, weight: 30, criteria: [{ name: "Research Quality", score: 92, maxScore: 100 }, { name: "Report Writing", score: 88, maxScore: 100 }], comments: "Excellent research work.", status: "finalized", date: "2025-02-15" },
];

export const mockMessages: Message[] = [
  { id: "m1", senderId: "u2", senderName: "Prof. James Wilson", receiverId: "u5", receiverName: "Alex Johnson", subject: "Logbook Feedback", content: "Your latest logbook entry looks great. Keep up the good work!", read: false, createdAt: new Date().toISOString() },
  { id: "m2", senderId: "u4", senderName: "Michael Brown", receiverId: "u5", receiverName: "Alex Johnson", subject: "Task Update", content: "Please prioritize the API documentation task this week.", read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "m3", senderId: "u5", senderName: "Alex Johnson", receiverId: "u2", receiverName: "Prof. James Wilson", subject: "Question about Report", content: "Could you clarify the format required for the final report?", read: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
];

export const mockGrades: Grade[] = [
  { id: "g1", studentId: "s4", studentName: "Sophie Chen", placementId: "p4", supervisorScore: 85, advisorScore: 90, evaluatorScore: 88, finalGrade: 87.7, letterGrade: "A-", status: "published" },
  { id: "g2", studentId: "u5", studentName: "Alex Johnson", placementId: "p1", supervisorScore: 82, advisorScore: 0, evaluatorScore: 0, finalGrade: 0, letterGrade: "-", status: "pending" },
];

export const mockComplaints: Complaint[] = [
  { id: "comp1", studentId: "s4", studentName: "Sophie Chen", subject: "Evaluation Score Discrepancy", description: "I believe the supervisor evaluation score does not reflect my actual performance.", status: "in_review", createdAt: new Date(Date.now() - 86400000).toISOString() },
];

export const mockCalendarEvents: CalendarEvent[] = [
  { id: "ev1", title: "Alex Johnson Defense", description: "Final internship defense presentation", date: "2025-04-25", time: "10:00", type: "defense", participants: ["Alex Johnson", "Prof. James Wilson", "Dr. Maria Garcia"] },
  { id: "ev2", title: "Progress Review Meeting", description: "Monthly progress review with all interns", date: "2025-04-15", time: "14:00", type: "meeting", participants: ["Prof. James Wilson", "All students"] },
  { id: "ev3", title: "Report Submission Deadline", description: "Final report submission deadline", date: "2025-04-30", time: "23:59", type: "deadline", participants: ["All students"] },
];

export const mockDocuments: Document[] = [
  { id: "d1", name: "Internship_Report_Draft.pdf", type: "pdf", size: "2.4 MB", uploadedBy: "Alex Johnson", uploadedAt: "2025-04-05", placementId: "p1", status: "pending" },
  { id: "d2", name: "Weekly_Summary_W14.docx", type: "docx", size: "156 KB", uploadedBy: "Alex Johnson", uploadedAt: "2025-04-07", placementId: "p1", status: "approved" },
  { id: "d3", name: "Company_Agreement.pdf", type: "pdf", size: "1.1 MB", uploadedBy: "TechCorp Solutions", uploadedAt: "2025-01-10", status: "approved" },
  { id: "d4", name: "Placement_Offer_Letter.pdf", type: "pdf", size: "450 KB", uploadedBy: "Academic Office", uploadedAt: "2025-04-10", status: "pending" },
];

export const mockActivities: ActivityEvent[] = [
  { id: "act1", placementId: "p1", type: "logbook_submitted", description: "Alex Johnson submitted a logbook entry", actor: "Alex Johnson", timestamp: new Date().toISOString() },
  { id: "act2", placementId: "p1", type: "attendance_recorded", description: "Attendance recorded: Present", actor: "Michael Brown", timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: "act3", placementId: "p1", type: "task_assigned", description: "New task assigned: Complete API Documentation", actor: "Michael Brown", timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: "act4", placementId: "p1", type: "logbook_approved", description: "Logbook entry approved by advisor", actor: "Prof. James Wilson", timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: "act5", placementId: "p1", type: "evaluation_submitted", description: "Company supervisor submitted evaluation", actor: "Michael Brown", timestamp: new Date(Date.now() - 172800000).toISOString() },
];
