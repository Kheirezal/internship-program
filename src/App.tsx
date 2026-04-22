import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { useUIStore } from "@/stores/uiStore";

// Layout
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

// Auth Pages
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";

// Coordinator
import CoordinatorDashboard from "@/pages/coordinator/CoordinatorDashboard";
import CompaniesPage from "@/pages/coordinator/CompaniesPage";
import RubricConfigPage from "@/pages/coordinator/RubricConfigPage";
import GradeCalculationPage from "@/pages/coordinator/GradeCalculationPage";
import ApplicationsPage from "@/pages/coordinator/ApplicationsPage";

// Advisor
import AdvisorDashboard from "@/pages/advisor/AdvisorDashboard";

// Department Head
import DepartmentHeadDashboard from "@/pages/dept-head/DepartmentHeadDashboard";
import StudentManagementPage from "@/pages/dept-head/StudentManagementPage";
import DeptHeadUserManagement from "@/pages/dept-head/UserManagementPage";
import DHGradeApprovalPage from "@/pages/dept-head/DHGradeApprovalPage";
import AnnouncementsPage from "@/pages/dept-head/AnnouncementsPage";
import OrientationPage from "@/pages/dept-head/OrientationPage";
import GapAnalysisPage from "@/pages/dept-head/GapAnalysisPage";

import ExamManagementPage from "@/pages/dept-head/ExamManagementPage";
import ExamEditorPage from "@/pages/dept-head/ExamEditorPage";
import LiveExamMonitorPage from "@/pages/dept-head/LiveExamMonitorPage";

// Supervisor
import SupervisorDashboard from "@/pages/supervisor/SupervisorDashboard";
import RecommendationsPage from "@/pages/supervisor/RecommendationsPage";

// Student
import StudentDashboard from "@/pages/student/StudentDashboard";
import InternshipOverviewPage from "@/pages/student/InternshipOverviewPage";
import StudentLogbooksPage from "@/pages/student/StudentLogbooksPage";
import SubmitReportPage from "@/pages/student/SubmitReportPage";
import InternshipApplicationPage from "@/pages/student/InternshipApplicationPage";

import StudentExamsPage from "@/pages/student/StudentExamsPage";
import TakeExamPage from "@/pages/student/TakeExamPage";

// Shared Pages
import PlacementsPage from "@/pages/shared/PlacementsPage";
import LogbooksPage from "@/pages/shared/LogbooksPage";
import EvaluationsPage from "@/pages/shared/EvaluationsPage";
import CalendarPage from "@/pages/shared/CalendarPage";
import MessagesPage from "@/pages/shared/MessagesPage";
import GradesPage from "@/pages/shared/GradesPage";
import ComplaintsPage from "@/pages/shared/ComplaintsPage";
import StudentsPage from "@/pages/shared/StudentsPage";
import DocumentsPage from "@/pages/shared/DocumentsPage";
import AttendancePage from "@/pages/shared/AttendancePage";
import TasksPage from "@/pages/shared/TasksPage";
import NotificationsPage from "@/pages/shared/NotificationsPage";
import ProfilePage from "@/pages/shared/ProfilePage";
import SettingsPage from "@/pages/shared/SettingsPage";
import HelpPage from "@/pages/shared/HelpPage";
import ReportsPage from "@/pages/shared/ReportsPage";
import DefensePage from "@/pages/shared/DefensePage";
import SiteVisitsPage from "@/pages/shared/SiteVisitsPage";

import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

// Detail Pages
import PlacementDetailPage from "@/pages/shared/PlacementDetailPage";
import UserManagementPage from "@/pages/coordinator/UserManagementPage";
import FAQPage from "@/pages/shared/FAQPage";
import ContactSupportPage from "@/pages/shared/ContactSupportPage";
import EvaluationDetailPage from "@/pages/shared/EvaluationDetailPage";
import LogbookDetailPage from "@/pages/shared/LogbookDetailPage";
import SupervisorAccessPage from "@/pages/coordinator/SupervisorAccessPage";

import { ThemeProvider } from "@/components/ui/theme-provider";

const queryClient = new QueryClient();

function ThemeInitializer() {
  const { theme } = useUIStore();
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <Sonner />
        <ThemeInitializer />
        <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Coordinator routes */}
          <Route element={<ProtectedRoute allowedRoles={["internship_coordinator"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/internship-coordinator" element={<CoordinatorDashboard />} />
              <Route path="/internship-coordinator/companies" element={<CompaniesPage />} />
              <Route path="/internship-coordinator/placements" element={<PlacementsPage />} />
              <Route path="/internship-coordinator/students" element={<StudentsPage />} />
              <Route path="/internship-coordinator/evaluations" element={<EvaluationsPage />} />
              <Route path="/internship-coordinator/calendar" element={<CalendarPage />} />
              <Route path="/internship-coordinator/reports" element={<ReportsPage />} />
              <Route path="/internship-coordinator/complaints" element={<ComplaintsPage />} />
              <Route path="/internship-coordinator/messages" element={<MessagesPage />} />
              <Route path="/internship-coordinator/users" element={<UserManagementPage />} />
              <Route path="/internship-coordinator/placements/:id" element={<PlacementDetailPage />} />
              <Route path="/internship-coordinator/students/:id" element={<PlacementDetailPage />} />
              <Route path="/internship-coordinator/users/access" element={<SupervisorAccessPage />} />
              <Route path="/internship-coordinator/rubric" element={<RubricConfigPage />} />
              <Route path="/internship-coordinator/grades" element={<GradeCalculationPage />} />
              <Route path="/internship-coordinator/site-visits" element={<SiteVisitsPage />} />
              <Route path="/internship-coordinator/applications" element={<ApplicationsPage />} />
              <Route path="/internship-coordinator/documents" element={<DocumentsPage />} />
            </Route>
          </Route>

          {/* Advisor routes (unified: advisor + evaluator context) */}
          <Route element={<ProtectedRoute allowedRoles={["internship_advisor", "department_head"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/internship-advisor" element={<AdvisorDashboard />} />
              <Route path="/internship-advisor/students" element={<StudentsPage />} />
              <Route path="/internship-advisor/logbooks" element={<LogbooksPage />} />
              <Route path="/internship-advisor/placements" element={<PlacementsPage />} />
              <Route path="/internship-advisor/evaluations" element={<EvaluationsPage />} />
              <Route path="/internship-advisor/calendar" element={<CalendarPage />} />
              <Route path="/internship-advisor/reports" element={<ReportsPage />} />
              <Route path="/internship-advisor/messages" element={<MessagesPage />} />
              <Route path="/internship-advisor/attendance" element={<AttendancePage />} />
              <Route path="/internship-advisor/defense" element={<DefensePage />} />
              <Route path="/internship-advisor/grades" element={<GradesPage />} />
              <Route path="/internship-advisor/placements/:id" element={<PlacementDetailPage />} />
              <Route path="/internship-advisor/students/:id" element={<PlacementDetailPage />} />
              <Route path="/internship-advisor/site-visits" element={<SiteVisitsPage />} />
            </Route>
          </Route>

          {/* Department Head */}
          <Route element={<ProtectedRoute allowedRoles={["department_head"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/department-head" element={<DepartmentHeadDashboard />} />
              <Route path="/department-head/students" element={<StudentManagementPage />} />
              <Route path="/department-head/users" element={<DeptHeadUserManagement />} />
              <Route path="/department-head/companies" element={<CompaniesPage />} />
              <Route path="/department-head/reports" element={<ReportsPage />} />
              <Route path="/department-head/messages" element={<MessagesPage />} />
              <Route path="/department-head/evaluations" element={<EvaluationsPage />} />
              <Route path="/department-head/defense" element={<DefensePage />} />
              <Route path="/department-head/grades" element={<DHGradeApprovalPage />} />
              <Route path="/department-head/announcements" element={<AnnouncementsPage />} />
              <Route path="/department-head/orientation" element={<OrientationPage />} />
              <Route path="/department-head/gap-analysis" element={<GapAnalysisPage />} />
              <Route path="/department-head/exams" element={<ExamManagementPage />} />
              <Route path="/department-head/exams/:id/edit" element={<ExamEditorPage />} />
              <Route path="/department-head/exams/:id/monitor" element={<LiveExamMonitorPage />} />
              <Route path="/department-head/calendar" element={<CalendarPage />} />
            </Route>
          </Route>

          {/* Company Supervisor routes */}
          <Route element={<ProtectedRoute allowedRoles={["company_supervisor"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/company-supervisor" element={<SupervisorDashboard />} />
              <Route path="/company-supervisor/interns" element={<StudentsPage />} />
              <Route path="/company-supervisor/attendance" element={<AttendancePage />} />
              <Route path="/company-supervisor/tasks" element={<TasksPage />} />
              <Route path="/company-supervisor/logbooks" element={<LogbooksPage />} />
              <Route path="/company-supervisor/evaluation" element={<EvaluationsPage />} />
              <Route path="/company-supervisor/messages" element={<MessagesPage />} />
              <Route path="/company-supervisor/interns/:id" element={<PlacementDetailPage />} />
              <Route path="/company-supervisor/recommendations" element={<RecommendationsPage />} />
            </Route>
          </Route>

          {/* Student routes */}
          <Route element={<ProtectedRoute allowedRoles={["internship_student"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/internship-student" element={<StudentDashboard />} />
              <Route path="/internship-student/internship" element={<InternshipOverviewPage />} />
              <Route path="/internship-student/logbooks" element={<StudentLogbooksPage />} />
              <Route path="/internship-student/submit-logbook" element={<StudentLogbooksPage />} />
              <Route path="/internship-student/documents" element={<DocumentsPage />} />
              <Route path="/internship-student/upload-document" element={<DocumentsPage />} />
              <Route path="/internship-student/submit-report" element={<SubmitReportPage />} />
              <Route path="/internship-student/tasks" element={<TasksPage />} />
              <Route path="/internship-student/grades" element={<GradesPage />} />
              <Route path="/internship-student/complaints" element={<ComplaintsPage />} />
              <Route path="/internship-student/messages" element={<MessagesPage />} />
              <Route path="/internship-student/apply" element={<InternshipApplicationPage />} />
              <Route path="/internship-student/exams" element={<StudentExamsPage />} />
              <Route path="/internship-student/exams/:id/take" element={<TakeExamPage />} />
              <Route path="/internship-student/attendance" element={<AttendancePage />} />
              <Route path="/internship-student/defense" element={<DefensePage />} />
            </Route>
          </Route>

          {/* Shared authenticated routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/contact-support" element={<ContactSupportPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/evaluations/:id" element={<EvaluationDetailPage />} />
              <Route path="/logbooks/:id" element={<LogbookDetailPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
