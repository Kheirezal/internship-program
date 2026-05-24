import type { Company, Placement, Logbook, Task, Attendance, Evaluation, Message, Grade, Complaint, CalendarEvent, DefenseSchedule, Document, ActivityEvent, SiteVisit, InternshipApplication, Announcement, StudentRoleAlert, StudentDocumentSubmission, Recommendation, RubricConfig, OrientationSession, GapAnalysis, Exam, ExamQuestion, ExamSubmission } from "@/types";

export const mockCompanies: Company[] = [
  { id: "c1", name: "TechCorp Solutions", industry: "Technology", address: "123 Silicon Ave", contactPerson: "John Smith", contactEmail: "john@techcorp.com", contactPhone: "+1-555-0101", status: "active", studentsCount: 8, maxCapacity: 10, positions: ["Frontend Developer", "Backend Engineer"], requiredSkills: ["React", "Node.js", "TypeScript"], duration: "4 Months", qualityRating: 4.5, partnerSince: "2022-01-15" },
  { id: "c2", name: "DataFlow Inc", industry: "Data Analytics", address: "456 Data Lane", contactPerson: "Jane Doe", contactEmail: "jane@dataflow.com", contactPhone: "+1-555-0102", status: "active", studentsCount: 5, maxCapacity: 6, positions: ["Data Analyst", "Python Developer"], requiredSkills: ["Python", "SQL", "Pandas"], duration: "4 Months", qualityRating: 4.2, partnerSince: "2023-03-10" },
  { id: "c3", name: "CloudNine Systems", industry: "Cloud Computing", address: "789 Cloud Blvd", contactPerson: "Bob Wilson", contactEmail: "bob@cloudnine.com", contactPhone: "+1-555-0103", status: "pending", studentsCount: 0, maxCapacity: 8, positions: ["DevOps Intern"], requiredSkills: ["AWS", "Docker", "Linux"], duration: "6 Months" },
  { id: "c4", name: "GreenTech Energy", industry: "Renewable Energy", address: "321 Green St", contactPerson: "Lisa Green", contactEmail: "lisa@greentech.com", contactPhone: "+1-555-0104", status: "active", studentsCount: 3, maxCapacity: 5, positions: ["Systems Engineer"], requiredSkills: ["C++", "Embedded Systems"], duration: "3 Months", qualityRating: 3.8, partnerSince: "2024-01-20" },
  { id: "c5", name: "MedTech Labs", industry: "Healthcare", address: "654 Health Rd", contactPerson: "Dr. Park", contactEmail: "park@medtech.com", contactPhone: "+1-555-0105", status: "blacklisted", studentsCount: 0, maxCapacity: 4, positions: ["QA Tester"], requiredSkills: ["Selenium", "Java"], duration: "4 Months", qualityRating: 2.1 },
];

export const mockPlacements: Placement[] = [
  { id: "p1", studentId: "u5", studentName: "Alex Johnson", companyId: "c1", companyName: "TechCorp Solutions", advisorId: "u2", advisorName: "Prof. James Wilson", supervisorId: "u4", supervisorName: "Michael Brown", evaluatorId: "a2", evaluatorName: "Dr. Emma Taylor", startDate: "2025-01-15", endDate: "2025-06-15", status: "active", progress: 65, projectTitle: "Internal HR Management System API", projectStatus: "approved" },
  { id: "p2", studentId: "s2", studentName: "Emily Davis", companyId: "c2", companyName: "DataFlow Inc", advisorId: "u2", advisorName: "Prof. James Wilson", supervisorId: "s6", supervisorName: "Sarah Lee", evaluatorId: "a3", evaluatorName: "Prof. Ahmed Hassan", startDate: "2025-02-01", endDate: "2025-07-01", status: "active", progress: 45, projectTitle: "Customer Segmentation using K-Means", projectStatus: "pending_approval" },
  { id: "p3", studentId: "s3", studentName: "Ryan Martinez", companyId: "c1", companyName: "TechCorp Solutions", advisorId: "u2", advisorName: "Prof. James Wilson", supervisorId: "u4", supervisorName: "Michael Brown", startDate: "2025-01-15", endDate: "2025-06-15", status: "pending_student_confirmation", progress: 0 },
  { id: "p4", studentId: "s4", studentName: "Sophie Chen", companyId: "c4", companyName: "GreenTech Energy", advisorId: "a2", advisorName: "Dr. Emma Taylor", supervisorId: "s7", supervisorName: "Tom Green", evaluatorId: "u2", evaluatorName: "Prof. James Wilson", startDate: "2024-09-01", endDate: "2025-02-01", status: "completed", progress: 100, projectTitle: "Solar Inverter Efficiency Monitoring", projectStatus: "approved" },
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
  { id: "e3", placementId: "p4", studentName: "Sophie Chen", evaluatorId: "u4", evaluatorName: "Michael Brown", evaluatorRole: "supervisor", score: 85, weight: 30, criteria: [{ name: "Technical Skills", score: 88, maxScore: 100 }, { name: "Teamwork", score: 82, maxScore: 100 }], comments: "Very reliable and proactive intern.", status: "finalized", date: "2025-02-10" },
  { id: "e4", placementId: "p4", studentName: "Sophie Chen", evaluatorId: "u2", evaluatorName: "Prof. James Wilson", evaluatorRole: "evaluator", score: 88, weight: 40, criteria: [{ name: "System Design", score: 90, maxScore: 100 }, { name: "Code Quality", score: 85, maxScore: 100 }, { name: "Documentation", score: 89, maxScore: 100 }], comments: "Outstanding project delivery.", status: "finalized", date: "2025-02-20" },
];

export const mockMessages: Message[] = [
  { id: "m1", senderId: "u2", senderName: "Prof. James Wilson", receiverId: "u5", receiverName: "Alex Johnson", subject: "Logbook Feedback", content: "Your latest logbook entry looks great. Keep up the good work!", read: false, createdAt: new Date().toISOString() },
  { id: "m2", senderId: "u4", senderName: "Michael Brown", receiverId: "u5", receiverName: "Alex Johnson", subject: "Task Update", content: "Please prioritize the API documentation task this week.", read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "m3", senderId: "u5", senderName: "Alex Johnson", receiverId: "u2", receiverName: "Prof. James Wilson", subject: "Question about Report", content: "Could you clarify the format required for the final report?", read: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
];

export const mockGrades: Grade[] = [
  { id: "g1", studentId: "s4", studentName: "Sophie Chen", placementId: "p4", supervisorScore: 85, advisorScore: 90, evaluatorScore: 88, finalGrade: 87.7, letterGrade: "A-", status: "published", dhApprovalStatus: "published", publishedAt: "2025-03-01" },
  { id: "g2", studentId: "u5", studentName: "Alex Johnson", placementId: "p1", supervisorScore: 82, advisorScore: 0, evaluatorScore: 0, finalGrade: 0, letterGrade: "-", status: "pending", dhApprovalStatus: "pending_coordinator" },
  { id: "g3", studentId: "s2", studentName: "Emily Davis", placementId: "p2", supervisorScore: 78, advisorScore: 85, evaluatorScore: 80, finalGrade: 81.1, letterGrade: "B+", status: "pending", dhApprovalStatus: "submitted_to_dh", submittedToDhAt: "2025-04-15" },
  { id: "g4", studentId: "s3", studentName: "Ryan Martinez", placementId: "p3", supervisorScore: 70, advisorScore: 75, evaluatorScore: 72, finalGrade: 72.3, letterGrade: "B-", status: "pending", dhApprovalStatus: "revision_requested", dhComments: "Please verify the evaluator score — seems inconsistent with report quality." },
];

export const mockComplaints: Complaint[] = [
  { id: "comp1", studentId: "s4", studentName: "Sophie Chen", subject: "Evaluation Score Discrepancy", description: "I believe the supervisor evaluation score does not reflect my actual performance.", category: "grade_dispute", status: "in_review", createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "comp2", studentId: "u5", studentName: "Alex Johnson", subject: "Workplace Environment Issue", description: "The assigned work area lacks proper ventilation and ergonomic setup.", category: "workplace", status: "open", createdAt: new Date(Date.now() - 172800000).toISOString() },
];

export const mockDefenseSchedules: DefenseSchedule[] = [
  {
    id: "def1",
    placementId: "p1",
    studentId: "u5",
    studentName: "Alex Johnson",
    companyName: "TechCorp Solutions",
    title: "Final Internship Defense — HR Management System",
    description: "Final internship defense presentation for the Internal HR Management System API project.",
    date: "2026-06-15",
    time: "10:00",
    location: "Room 301, Engineering Building A",
    duration: "60 minutes",
    panelMembers: ["Prof. James Wilson", "Dr. Maria Garcia", "Michael Brown"],
  },
];

export const mockCalendarEvents: CalendarEvent[] = [
  { id: "ev1", title: "Alex Johnson Defense", description: "Final internship defense presentation", date: "2026-06-15", time: "10:00", type: "defense", participants: ["Alex Johnson", "Prof. James Wilson", "Dr. Maria Garcia"] },
  { id: "ev2", title: "Progress Review Meeting", description: "Monthly progress review with all interns", date: "2026-04-15", time: "14:00", type: "meeting", participants: ["Prof. James Wilson", "All students"] },
  { id: "ev3", title: "Report Submission Deadline", description: "Final report submission deadline", date: "2026-04-30", time: "23:59", type: "deadline", participants: ["All students"] },
  { id: "ev4", title: "TechCorp Site Visit", description: "Advisor site visit to TechCorp Solutions", date: "2026-04-20", time: "10:00", type: "site_visit", participants: ["Prof. James Wilson", "Michael Brown", "Alex Johnson"] },
  { id: "ev5", title: "Professional Ethics Workshop", description: "Orientation session on workplace ethics and NDA", date: "2026-01-12", time: "09:00", type: "orientation", participants: ["All students"] },
  { id: "ev6", title: "Spring Placement Kickoff", description: "Coordinator briefing for new internship cohort", date: "2026-02-03", time: "11:00", type: "meeting", participants: ["Dr. Sarah Chen", "All advisors"] },
  { id: "ev7", title: "Logbook Review Deadline", description: "Weekly logbook entries due for March", date: "2026-03-28", time: "23:59", type: "deadline", participants: ["All students"] },
  { id: "ev8", title: "Industry Partner Day", description: "Company supervisors meet academic staff", date: "2026-05-22", time: "13:00", type: "event", participants: ["Partner companies", "Coordinators"] },
  { id: "ev9", title: "Mid-Year Evaluation Deadline", description: "Supervisor evaluations must be submitted", date: "2026-07-01", time: "23:59", type: "deadline", participants: ["Company supervisors"] },
  { id: "ev10", title: "Fall Orientation Session", description: "NDA and workplace conduct for new interns", date: "2026-09-08", time: "09:00", type: "orientation", participants: ["All students"] },
  { id: "ev11", title: "Year-End Program Review", description: "Department review of internship outcomes", date: "2026-11-18", time: "15:00", type: "meeting", participants: ["Dr. Maria Garcia", "Dr. Sarah Chen"] },
];

export const mockDocuments: Document[] = [
  { id: "d1", name: "Internship_Report_Draft.pdf", type: "pdf", size: "2.4 MB", uploadedBy: "Alex Johnson", uploadedAt: "2025-04-05", placementId: "p1", status: "pending", category: "report" },
  { id: "d2", name: "Weekly_Summary_W14.docx", type: "docx", size: "156 KB", uploadedBy: "Alex Johnson", uploadedAt: "2025-04-07", placementId: "p1", status: "approved", category: "report" },
  { id: "d3", name: "Company_Agreement.pdf", type: "pdf", size: "1.1 MB", uploadedBy: "TechCorp Solutions", uploadedAt: "2025-01-10", status: "approved", category: "agreement" },
  { id: "d4", name: "Placement_Offer_Letter.pdf", type: "pdf", size: "450 KB", uploadedBy: "Academic Office", uploadedAt: "2025-04-10", status: "pending", category: "letter" },
  { id: "d5", name: "Introduction_Letter_Alex.pdf", type: "pdf", size: "320 KB", uploadedBy: "Coordinator Office", uploadedAt: "2025-01-10", status: "approved", category: "letter" },
  { id: "d6", name: "Insurance_Certificate.pdf", type: "pdf", size: "890 KB", uploadedBy: "Academic Office", uploadedAt: "2025-01-05", status: "approved", category: "insurance" },
  { id: "d7", name: "Acceptance_Form_Emily.pdf", type: "pdf", size: "210 KB", uploadedBy: "DataFlow Inc", uploadedAt: "2025-01-28", status: "approved", category: "acceptance" },
];

export const mockActivities: ActivityEvent[] = [
  { id: "act1", placementId: "p1", type: "logbook_submitted", description: "Alex Johnson submitted a logbook entry", actor: "Alex Johnson", timestamp: new Date().toISOString() },
  { id: "act2", placementId: "p1", type: "attendance_recorded", description: "Attendance recorded: Present", actor: "Michael Brown", timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: "act3", placementId: "p1", type: "task_assigned", description: "New task assigned: Complete API Documentation", actor: "Michael Brown", timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: "act4", placementId: "p1", type: "logbook_approved", description: "Logbook entry approved by advisor", actor: "Prof. James Wilson", timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: "act5", placementId: "p1", type: "evaluation_submitted", description: "Company supervisor submitted evaluation", actor: "Michael Brown", timestamp: new Date(Date.now() - 172800000).toISOString() },
];

// ── New Mock Data ──

export const mockSiteVisits: SiteVisit[] = [
  { id: "sv1", placementId: "p1", studentId: "u5", studentName: "Alex Johnson", companyName: "TechCorp Solutions", advisorId: "u2", advisorName: "Prof. James Wilson", supervisorId: "u4", supervisorName: "Michael Brown", scheduledDate: "2025-04-20", scheduledTime: "10:00", status: "scheduled", notes: "Review project progress and work environment" },
  { id: "sv2", placementId: "p2", studentId: "s2", studentName: "Emily Davis", companyName: "DataFlow Inc", advisorId: "u2", advisorName: "Prof. James Wilson", supervisorId: "s6", supervisorName: "Sarah Lee", scheduledDate: "2025-04-22", scheduledTime: "14:00", status: "scheduled" },
  { id: "sv3", placementId: "p4", studentId: "s4", studentName: "Sophie Chen", companyName: "GreenTech Energy", advisorId: "a2", advisorName: "Dr. Emma Taylor", supervisorId: "s7", supervisorName: "Tom Green", scheduledDate: "2025-01-15", scheduledTime: "11:00", status: "completed", notes: "Verified excellent work environment", findings: "Student is well-integrated into team. Office has proper facilities. Tasks are relevant to academic goals.", workEnvironmentRating: 5, taskRelevanceRating: 4 },
];

export const mockApplications: InternshipApplication[] = [
  { id: "app1", studentId: "u5", studentName: "Alex Johnson", companyName: "TechCorp Solutions", companyContact: "John Smith", companyEmail: "john@techcorp.com", companyAddress: "123 Silicon Ave", proposedRole: "Backend Developer Intern", isSelfFound: true, status: "approved", submittedAt: "2025-01-05", reviewedAt: "2025-01-08" },
  { id: "app2", studentId: "s5", studentName: "Liam Park", companyName: "StartupXYZ", companyContact: "Anna Kim", companyEmail: "anna@startupxyz.com", companyAddress: "88 Innovation Way", proposedRole: "Full-Stack Developer", isSelfFound: true, status: "under_review", submittedAt: "2025-04-10" },
  { id: "app3", studentId: "s6r", studentName: "Maya Thompson", companyName: "", companyContact: "", companyEmail: "", companyAddress: "", proposedRole: "Data Science Intern", isSelfFound: false, status: "submitted", submittedAt: "2025-04-12", coordinatorNotes: "Student requests university placement" },
];

export const mockAnnouncements: Announcement[] = [
  { id: "ann1", title: "Internship Portal Now Live for Batch 2026", content: "The internship portal is now open for applications. All eligible students must submit their applications by April 30, 2025. Please ensure your GPA meets the minimum requirement of 2.5 and all prerequisite courses are completed.", authorId: "u3", authorName: "Dr. Maria Garcia", authorRole: "department_head", targetRoles: ["internship_student", "internship_advisor"], priority: "important", createdAt: new Date(Date.now() - 604800000).toISOString() },
  { id: "ann2", title: "Updated Evaluation Rubric Published", content: "The evaluation rubric for this semester has been updated. Company Supervisor (30%), Academic Advisor (30%), Academic Evaluator (40%). Please review the criteria before submitting evaluations.", authorId: "u3", authorName: "Dr. Maria Garcia", authorRole: "department_head", targetRoles: ["internship_coordinator", "internship_advisor", "company_supervisor"], priority: "normal", createdAt: new Date(Date.now() - 259200000).toISOString() },
  { id: "ann3", title: "NDA Compliance Reminder", content: "All interns must sign the Non-Disclosure Agreement before starting their placement. Failure to comply will result in placement cancellation.", authorId: "u3", authorName: "Dr. Maria Garcia", authorRole: "department_head", targetRoles: ["internship_student"], priority: "urgent", createdAt: new Date(Date.now() - 86400000).toISOString() },
];

export const mockStudentRoleAlerts: StudentRoleAlert[] = [
  {
    id: "sra1",
    studentId: "u5",
    fromRole: "internship_advisor",
    fromName: "Prof. James Wilson",
    title: "Mid-term progress check-in",
    message: "Share your draft report outline and book a 15-minute review meeting.",
    dueDate: "2026-05-28",
    priority: "important",
    link: "/internship-student/messages",
  },
  {
    id: "sra2",
    studentId: "u5",
    fromRole: "internship_coordinator",
    fromName: "Dr. Maria Garcia",
    title: "Insurance certificate upload",
    message: "Upload your signed insurance certificate before placement verification closes.",
    dueDate: "2026-05-25",
    priority: "urgent",
    link: "/internship-student/documents",
  },
  {
    id: "sra3",
    studentId: "u5",
    fromRole: "company_supervisor",
    fromName: "Michael Brown",
    title: "API documentation deliverable",
    message: "Complete and submit API documentation for the auth module review.",
    dueDate: "2026-05-30",
    priority: "normal",
    link: "/internship-student/tasks",
  },
];

export const mockStudentDocumentSubmissions: StudentDocumentSubmission[] = [
  {
    id: "sub1",
    studentId: "u5",
    placementId: "p1",
    documentType: "proposal",
    recipientRole: "internship_advisor",
    recipientName: "Prof. James Wilson",
    fileName: "Project_Proposal_v1.pdf",
    notes: "Initial project scope and objectives",
    status: "approved",
    submittedAt: new Date(Date.now() - 1209600000).toISOString(),
  },
  {
    id: "sub2",
    studentId: "u5",
    placementId: "p1",
    documentType: "srs",
    recipientRole: "company_supervisor",
    recipientName: "Michael Brown",
    fileName: "SRS_HR_System.pdf",
    status: "pending",
    submittedAt: new Date(Date.now() - 432000000).toISOString(),
  },
];

export const mockRecommendations: Recommendation[] = [
  { id: "rec1", studentId: "s4", studentName: "Sophie Chen", supervisorId: "s7", supervisorName: "Tom Green", type: "employment", rating: 5, strengths: "Excellent problem-solving, strong communication, self-driven learner", improvements: "Could improve on time management for complex tasks", comments: "Sophie would be an excellent addition to any engineering team. Highly recommend for full-time employment.", submittedAt: "2025-02-01" },
];

export const mockRubricConfigs: RubricConfig[] = [
  {
    id: "rub1",
    name: "Standard Internship Evaluation Rubric",
    criteria: [
      { name: "Technical Skills", maxScore: 100, description: "Proficiency in tools, languages, and technologies used during internship" },
      { name: "Communication", maxScore: 100, description: "Written and verbal communication effectiveness" },
      { name: "Teamwork", maxScore: 100, description: "Collaboration with team members and stakeholders" },
      { name: "Problem Solving", maxScore: 100, description: "Analytical thinking and creative solutions" },
      { name: "Initiative", maxScore: 100, description: "Proactive behavior and willingness to learn" },
      { name: "Documentation", maxScore: 100, description: "Quality of reports, logbooks, and technical documentation" },
    ],
    weights: { supervisor: 30, advisor: 30, evaluator: 40 },
    isActive: true,
    createdAt: "2025-01-01",
    updatedAt: "2025-03-15",
  },
];

export const mockOrientationSessions: OrientationSession[] = [
  { id: "ort1", title: "Professional Ethics & Workplace Conduct", description: "Comprehensive session on professional ethics, code of conduct, and workplace behavior expectations during internship.", topic: "professional_ethics", date: "2025-01-10", time: "09:00", duration: "2 hours", location: "Main Auditorium, Building A", presenter: "Dr. Maria Garcia", status: "completed", attendees: ["u5", "s2", "s3", "s4"], materials: ["Ethics_Handbook.pdf"] },
  { id: "ort2", title: "NDA & Confidentiality Training", description: "Training session on Non-Disclosure Agreements, data handling, and intellectual property protection.", topic: "nda", date: "2025-01-12", time: "10:00", duration: "1.5 hours", location: "Conference Room 201", presenter: "Legal Office", status: "completed", attendees: ["u5", "s2", "s3", "s4"] },
  { id: "ort3", title: "Industry Expectations Workshop", description: "Workshop with industry professionals on what companies expect from interns.", topic: "industry_expectations", date: "2025-04-28", time: "14:00", duration: "3 hours", location: "Virtual (Zoom)", presenter: "Industry Panel", status: "scheduled", attendees: [] },
];

export const mockGapAnalysis: GapAnalysis[] = [
  { id: "ga1", skillArea: "API Integration & REST Design", occurrenceCount: 12, severity: "high", suggestedAction: "Add advanced API design module to Software Engineering course", relatedCourses: ["CS301 - Software Engineering", "CS405 - Web Development"], identifiedAt: "2025-03-15" },
  { id: "ga2", skillArea: "Version Control (Git Advanced)", occurrenceCount: 8, severity: "medium", suggestedAction: "Include Git branching strategies in introductory courses", relatedCourses: ["CS101 - Programming Fundamentals"], identifiedAt: "2025-03-15" },
  { id: "ga3", skillArea: "Database Optimization", occurrenceCount: 5, severity: "medium", suggestedAction: "Expand query optimization topics in Database Systems course", relatedCourses: ["CS302 - Database Systems"], identifiedAt: "2025-03-15" },
  { id: "ga4", skillArea: "Agile/Scrum Methodology", occurrenceCount: 15, severity: "high", suggestedAction: "Introduce Agile project management as mandatory module", relatedCourses: ["CS401 - Software Project Management"], identifiedAt: "2025-03-15" },
];

// ── Exam System Mock Data ──

export const mockQuestions: ExamQuestion[] = [
  { id: "q1", courseId: "CS301", topic: "Software Engineering", difficulty: "Medium", type: "MCQ", text: "Which Agile methodology uses sprints?", options: ["Scrumban", "Kanban", "Scrum", "Waterfall"], correctAnswer: "Scrum" },
  { id: "q2", courseId: "CS405", topic: "Web Development", difficulty: "Easy", type: "TrueFalse", text: "React is a server-side framework by default.", options: ["True", "False"], correctAnswer: "False" },
  { id: "q3", courseId: "CS302", topic: "Databases", difficulty: "Hard", type: "MCQ", text: "Which normal form deals with multi-valued dependencies?", options: ["1NF", "2NF", "3NF", "4NF"], correctAnswer: "4NF" },
];

export const mockExams: Exam[] = [
  {
    id: "exam1",
    title: "Mid-Term Software Concepts Exam",
    courses: ["CS301", "CS405"],
    status: "Active",
    passwordSet: true,
    scheduledStart: new Date(Date.now() - 3600000).toISOString(),
    scheduledEnd: new Date(Date.now() + 3600000).toISOString(),
    durationMinutes: 60,
    totalQuestions: 3,
    questions: mockQuestions,
    createdAt: "2025-04-10T10:00:00Z"
  },
  {
    id: "exam2",
    title: "Final Comprehensive Assessment",
    courses: ["CS301", "CS302", "CS405", "CS401"],
    status: "Scheduled",
    passwordSet: true,
    scheduledStart: "2025-05-15T09:00:00Z",
    scheduledEnd: "2025-05-15T12:00:00Z",
    durationMinutes: 120,
    totalQuestions: 100,
    questions: [],
    createdAt: "2025-04-20T14:00:00Z"
  },
  {
    id: "exam3",
    title: "Database Fundamentals Review",
    courses: ["CS302"],
    status: "Draft",
    passwordSet: false,
    durationMinutes: 45,
    totalQuestions: 20,
    questions: [],
    createdAt: "2025-04-21T08:00:00Z"
  }
];

export const mockSubmissions: ExamSubmission[] = [
  {
    id: "sub1",
    examId: "exam1",
    studentId: "s4",
    studentName: "Sophie Chen",
    department: "Computer Science",
    answers: { "q1": "Scrum", "q2": "False", "q3": "3NF" },
    score: 2,
    totalScore: 3,
    percentage: 66.67,
    submittedAt: new Date(Date.now() - 1800000).toISOString(),
    isAutoSubmitted: false
  }
];
