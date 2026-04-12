import type { Placement, Logbook, Attendance, Evaluation, Grade, Task } from "@/types";
import { mockPlacements, mockLogbooks, mockAttendance, mockEvaluations, mockGrades, mockTasks } from "@/data/mockData";

export interface AutoReport {
  id: string;
  generatedAt: string;
  type: 
    | "student_progress" 
    | "placement_summary" 
    | "attendance_summary" 
    | "evaluation_summary" 
    | "program_overview"
    | "task_progress"
    | "risk_alert"
    | "grade_calculation"
    | "weekly_summary"
    | "completion_report"
    | "logbook_activity"
    | "attendance_detailed"
    | "report_lifecycle"
    | "defense_schedule"
    | "complaint_summary"
    | "comm_activity"
    | "doc_submission";
  title: string;
  data: Record<string, unknown>;
}

export const reportService = {
  // 1. Internship Progress Monitoring
  generateStudentProgress: (studentId: string): AutoReport => {
    const placement = mockPlacements.find(p => p.studentId === studentId);
    return {
      id: "rpt-" + Math.random().toString(36).substr(2, 9),
      generatedAt: new Date().toISOString(),
      type: "student_progress",
      title: `Progress Monitoring – ${placement?.studentName}`,
      data: {
        progress: placement?.progress || 0,
        status: placement?.status,
        startDate: placement?.startDate,
        endDate: placement?.endDate,
        timeline: [
          { event: "Placement Approved", date: placement?.startDate, status: "completed" },
          { event: "Mid-term Evaluation", date: "2024-03-15", status: placement && placement.progress > 50 ? "completed" : "pending" },
          { event: "Final Report", date: placement?.endDate, status: placement?.status === "completed" ? "completed" : "pending" }
        ]
      }
    };
  },

  // 4. Task Progress Reports
  generateTaskReport: (studentId: string): AutoReport => {
    const tasks = mockTasks.filter(t => t.assignedTo === studentId);
    const completed = tasks.filter(t => t.status === "completed").length;
    return {
      id: "rpt-" + Math.random().toString(36).substr(2, 9),
      generatedAt: new Date().toISOString(),
      type: "task_progress",
      title: `Task Performance Insight`,
      data: {
        totalTasks: tasks.length,
        completedTasks: completed,
        completionRate: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0,
        overdue: tasks.filter(t => t.status !== "completed" && new Date(t.dueDate) < new Date()).length,
        details: tasks.map(t => ({ title: t.title, status: t.status, priority: t.priority }))
      }
    };
  },

  // 8. Grade Calculation Reports
  generateGradeReport: (studentId: string): AutoReport => {
    const grade = mockGrades.find(g => g.studentId === studentId);
    return {
      id: "rpt-" + Math.random().toString(36).substr(2, 9),
      generatedAt: new Date().toISOString(),
      type: "grade_calculation",
      title: `Final Grade Breakdown`,
      data: {
        supervisorScore: grade?.supervisorScore || 0,
        advisorScore: grade?.advisorScore || 0,
        evaluatorScore: grade?.evaluatorScore || 0,
        weightage: { supervisor: "30%", advisor: "30%", evaluator: "40%" },
        finalScore: grade?.finalGrade || 0,
        letterGrade: grade?.letterGrade || "N/A"
      }
    };
  },

  // 10. Risk & Alert Reports
  generateRiskReport: (): AutoReport => {
    const risks = [];
    // Detect low attendance
    mockPlacements.forEach(p => {
      const attendance = mockAttendance.filter(a => a.studentId === p.studentId);
      const absent = attendance.filter(a => a.status === "absent").length;
      if (absent > 2) risks.push({ student: p.studentName, risk: "Low Attendance", detail: `${absent} absences detected` });
      
      const missingLogbooks = 5 - mockLogbooks.filter(l => l.studentId === p.studentId).length;
      if (missingLogbooks > 2) risks.push({ student: p.studentName, risk: "Missing Logbooks", detail: `${missingLogbooks} entries expected` });
    });

    return {
      id: "rpt-" + Math.random().toString(36).substr(2, 9),
      generatedAt: new Date().toISOString(),
      type: "risk_alert",
      title: "Consolidated Risk & Alert Report",
      data: { activeRisks: risks.length, details: risks }
    };
  },

  // 14. Weekly Internship Summary
  generateWeeklySummary: (studentId: string): AutoReport => {
    return {
      id: "rpt-" + Math.random().toString(36).substr(2, 9),
      generatedAt: new Date().toISOString(),
      type: "weekly_summary",
      title: "Weekly Internship Portfolio",
      data: {
        logbooks: mockLogbooks.filter(l => l.studentId === studentId).length,
        attendance: "95%",
        tasksCompleted: mockTasks.filter(t => t.assignedTo === studentId && t.status === "completed").length,
        evalProgress: "Mid-way"
      }
    };
  },

  generatePlacementSummary: () => ({
    id: "rpt-ps",
    generatedAt: new Date().toISOString(),
    type: "placement_summary",
    title: "Global Placement Summary",
    data: { total: mockPlacements.length, active: mockPlacements.filter(p => p.status === "active").length }
  }),

  generateAll: (): AutoReport[] => [
    reportService.generatePlacementSummary() as AutoReport,
    reportService.generateRiskReport(),
  ]
};
