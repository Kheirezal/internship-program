import { mockPlacements, mockLogbooks, mockAttendance, mockTasks, mockEvaluations, mockGrades, mockStudentDocumentSubmissions, mockSiteVisits } from "@/data/mockData";

export interface DashboardInsight {
  type: "warning" | "info" | "success" | "danger";
  message: string;
  count?: number;
  link?: string;
}

export const analyticsService = {
  getCoordinatorInsights: (): DashboardInsight[] => {
    const insights: DashboardInsight[] = [];
    
    // Missing logbooks
    const pendingLogbooks = mockLogbooks.filter(l => l.status === "submitted").length;
    if (pendingLogbooks > 0) {
      insights.push({ 
        type: "info", 
        message: `${pendingLogbooks} logbooks waiting for advisor review`, 
        count: pendingLogbooks,
        link: "/internship-coordinator/reports" 
      });
    }

    // Pending evaluations
    const pendingEvals = mockEvaluations.filter(e => e.status !== "finalized").length;
    if (pendingEvals > 0) {
      insights.push({ 
        type: "warning", 
        message: `${pendingEvals} evaluations pending`, 
        count: pendingEvals,
        link: "/internship-coordinator/grades" 
      });
    }

    // Near completion
    const nearCompletion = mockPlacements.filter(p => p.progress >= 80 && p.status === "active").length;
    if (nearCompletion > 0) {
      insights.push({ 
        type: "success", 
        message: `${nearCompletion} internships nearing completion`, 
        count: nearCompletion,
        link: "/internship-coordinator/placements"
      });
    }

    // Risks
    const lowAttendance = mockAttendance.filter(a => a.status === "absent").length;
    if (lowAttendance > 3) {
      insights.push({ 
        type: "danger", 
        message: "High absence rate detected in some placements", 
        link: "/internship-coordinator/reports" 
      });
    }

    return insights;
  },

  getAdvisorInsights: (advisorId?: string): DashboardInsight[] => {
    const insights: DashboardInsight[] = [];
    const myPlacementIds = advisorId
      ? mockPlacements.filter((p) => p.advisorId === advisorId).map((p) => p.id)
      : mockPlacements.map((p) => p.id);

    const myLogbooks = mockLogbooks.filter((l) => myPlacementIds.includes(l.placementId));
    const pendingLogbooks = myLogbooks.filter((l) => l.status === "submitted").length;
    if (pendingLogbooks > 0) {
      insights.push({ type: "warning", message: `${pendingLogbooks} logbooks need your review`, count: pendingLogbooks, link: "/internship-advisor/logbooks" });
    }

    const pendingSubmissions = mockStudentDocumentSubmissions.filter(
      (s) => s.recipientRole === "internship_advisor" && s.status === "pending" &&
        (!advisorId || mockPlacements.find((p) => p.id === s.placementId)?.advisorId === advisorId)
    ).length;
    if (pendingSubmissions > 0) {
      insights.push({ type: "info", message: `${pendingSubmissions} document submissions awaiting approval`, count: pendingSubmissions, link: "/internship-advisor/submissions" });
    }

    const upcomingVisits = mockSiteVisits.filter(
      (v) => v.status === "scheduled" && (!advisorId || v.advisorId === advisorId)
    ).length;
    if (upcomingVisits > 0) {
      insights.push({ type: "info", message: `${upcomingVisits} site visits scheduled this month`, count: upcomingVisits, link: "/internship-advisor/site-visits" });
    }

    const lateAttendance = mockAttendance.filter((a) => a.status === "late").length;
    if (lateAttendance > 0) {
      insights.push({ type: "warning", message: `${lateAttendance} late check-ins among your students`, count: lateAttendance, link: "/internship-advisor/attendance" });
    }

    const absentStudents = mockAttendance.filter((a) => a.status === "absent").length;
    if (absentStudents > 0) {
      insights.push({ type: "danger", message: `${absentStudents} absence alerts recorded today`, count: absentStudents, link: "/internship-advisor/attendance" });
    }

    const nearCompletion = mockPlacements.filter(
      (p) => myPlacementIds.includes(p.id) && p.progress >= 80 && p.status === "active"
    ).length;
    if (nearCompletion > 0) {
      insights.push({ type: "success", message: `${nearCompletion} students nearing internship completion`, count: nearCompletion, link: "/internship-advisor/students" });
    }

    return insights;
  },

  getSupervisorInsights: (): DashboardInsight[] => {
    const insights: DashboardInsight[] = [];
    
    const overdueTasks = mockTasks.filter(t => t.status !== "completed" && new Date(t.dueDate) < new Date()).length;
    if (overdueTasks > 0) {
      insights.push({ type: "danger", message: `${overdueTasks} tasks are currently overdue`, count: overdueTasks, link: "/company-supervisor/tasks" });
    }

    const missingAttendance = 1; // Simulated
    insights.push({ type: "warning", message: `${missingAttendance} intern missing attendance today`, count: missingAttendance, link: "/company-supervisor/attendance" });

    return insights;
  },

  getStudentInsights: (studentId: string): DashboardInsight[] => {
    const insights: DashboardInsight[] = [];
    
    const tasks = mockTasks.filter(t => t.assignedTo === studentId && t.status !== "completed").length;
    if (tasks > 0) {
      insights.push({ type: "info", message: `You have ${tasks} pending tasks`, count: tasks, link: "/internship-student/tasks" });
    }

    const latestLogbook = mockLogbooks.filter(l => l.studentId === studentId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    const today = new Date().toISOString().split('T')[0];
    if (!latestLogbook || latestLogbook.date !== today) {
      insights.push({ type: "warning", message: "Submit your weekly logbook entry", link: "/internship-student/logbooks" });
    }

    return insights;
  }
};
