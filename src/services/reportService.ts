import type { Placement, Logbook, Attendance, Evaluation, Grade } from "@/types";
import { mockPlacements, mockLogbooks, mockAttendance, mockEvaluations, mockGrades } from "@/data/mockData";

export interface AutoReport {
  id: string;
  generatedAt: string;
  type: "student_progress" | "placement_summary" | "attendance_summary" | "evaluation_summary" | "program_overview";
  title: string;
  data: Record<string, unknown>;
}

function generateStudentProgressReport(studentId: string): AutoReport {
  const placements = mockPlacements.filter(p => p.studentId === studentId);
  const logbooks = mockLogbooks.filter(l => l.studentId === studentId);
  const attendance = mockAttendance.filter(a => a.studentId === studentId);
  const placement = placements[0];
  const grade = mockGrades.find(g => g.studentId === studentId);

  const totalDays = attendance.length;
  const presentDays = attendance.filter(a => a.status === "present" || a.status === "late").length;
  const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  return {
    id: "rpt-" + Date.now(),
    generatedAt: new Date().toISOString(),
    type: "student_progress",
    title: `Progress Report – ${placement?.studentName || "Student"}`,
    data: {
      student: placement?.studentName,
      company: placement?.companyName,
      advisor: placement?.advisorName,
      supervisor: placement?.supervisorName,
      period: placement ? `${placement.startDate} to ${placement.endDate}` : "N/A",
      progress: placement?.progress || 0,
      status: placement?.status || "N/A",
      logbooksSubmitted: logbooks.length,
      logbooksApproved: logbooks.filter(l => l.status === "approved").length,
      logbooksPending: logbooks.filter(l => l.status === "submitted").length,
      attendanceRate,
      totalAttendanceDays: totalDays,
      lateDays: attendance.filter(a => a.status === "late").length,
      absentDays: attendance.filter(a => a.status === "absent").length,
      supervisorScore: grade?.supervisorScore || 0,
      advisorScore: grade?.advisorScore || 0,
      evaluatorScore: grade?.evaluatorScore || 0,
      finalGrade: grade?.finalGrade || 0,
      letterGrade: grade?.letterGrade || "Pending",
    },
  };
}

function generatePlacementSummary(): AutoReport {
  const active = mockPlacements.filter(p => p.status === "active");
  const completed = mockPlacements.filter(p => p.status === "completed");
  const avgProgress = Math.round(active.reduce((sum, p) => sum + p.progress, 0) / (active.length || 1));

  return {
    id: "rpt-" + Date.now(),
    generatedAt: new Date().toISOString(),
    type: "placement_summary",
    title: "Placement Summary Report",
    data: {
      totalPlacements: mockPlacements.length,
      activePlacements: active.length,
      completedPlacements: completed.length,
      averageProgress: avgProgress,
      placements: mockPlacements.map(p => ({
        student: p.studentName,
        company: p.companyName,
        progress: p.progress,
        status: p.status,
      })),
    },
  };
}

function generateAttendanceSummary(): AutoReport {
  const byStudent: Record<string, { name: string; present: number; late: number; absent: number; total: number }> = {};
  mockAttendance.forEach(a => {
    if (!byStudent[a.studentId]) byStudent[a.studentId] = { name: a.studentName, present: 0, late: 0, absent: 0, total: 0 };
    byStudent[a.studentId].total++;
    if (a.status === "present") byStudent[a.studentId].present++;
    else if (a.status === "late") byStudent[a.studentId].late++;
    else if (a.status === "absent") byStudent[a.studentId].absent++;
  });

  return {
    id: "rpt-" + Date.now(),
    generatedAt: new Date().toISOString(),
    type: "attendance_summary",
    title: "Attendance Summary Report",
    data: {
      totalRecords: mockAttendance.length,
      students: Object.values(byStudent).map(s => ({
        ...s,
        rate: Math.round(((s.present + s.late) / s.total) * 100),
      })),
    },
  };
}

function generateEvaluationSummary(): AutoReport {
  const avgScore = Math.round(mockEvaluations.reduce((s, e) => s + e.score, 0) / (mockEvaluations.length || 1));

  return {
    id: "rpt-" + Date.now(),
    generatedAt: new Date().toISOString(),
    type: "evaluation_summary",
    title: "Evaluation Summary Report",
    data: {
      totalEvaluations: mockEvaluations.length,
      averageScore: avgScore,
      finalized: mockEvaluations.filter(e => e.status === "finalized").length,
      pending: mockEvaluations.filter(e => e.status !== "finalized").length,
      evaluations: mockEvaluations.map(e => ({
        student: e.studentName,
        evaluator: e.evaluatorName,
        role: e.evaluatorRole,
        score: e.score,
        status: e.status,
      })),
    },
  };
}

function generateProgramOverview(): AutoReport {
  return {
    id: "rpt-" + Date.now(),
    generatedAt: new Date().toISOString(),
    type: "program_overview",
    title: "Program Overview Report",
    data: {
      ...generatePlacementSummary().data,
      attendance: generateAttendanceSummary().data,
      evaluations: generateEvaluationSummary().data,
      grades: {
        total: mockGrades.length,
        published: mockGrades.filter(g => g.status === "published").length,
        averageFinal: Math.round(mockGrades.filter(g => g.finalGrade > 0).reduce((s, g) => s + g.finalGrade, 0) / (mockGrades.filter(g => g.finalGrade > 0).length || 1)),
      },
    },
  };
}

export const reportService = {
  generateStudentProgress: generateStudentProgressReport,
  generatePlacementSummary,
  generateAttendanceSummary,
  generateEvaluationSummary,
  generateProgramOverview,
  generateAll: (): AutoReport[] => [
    generateProgramOverview(),
    generatePlacementSummary(),
    generateAttendanceSummary(),
    generateEvaluationSummary(),
  ],
};
