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

// Advisor
import AdvisorDashboard from "@/pages/advisor/AdvisorDashboard";

// Evaluator
import EvaluatorDashboard from "@/pages/evaluator/EvaluatorDashboard";

// Supervisor
import SupervisorDashboard from "@/pages/supervisor/SupervisorDashboard";

// Student
import StudentDashboard from "@/pages/student/StudentDashboard";
import InternshipOverviewPage from "@/pages/student/InternshipOverviewPage";
import StudentLogbooksPage from "@/pages/student/StudentLogbooksPage";
import SubmitReportPage from "@/pages/student/SubmitReportPage";

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

import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

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
            </Route>
          </Route>

          {/* Advisor routes */}
          <Route element={<ProtectedRoute allowedRoles={["internship_advisor"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/internship-advisor" element={<AdvisorDashboard />} />
              <Route path="/internship-advisor/students" element={<StudentsPage />} />
              <Route path="/internship-advisor/logbooks" element={<LogbooksPage />} />
              <Route path="/internship-advisor/placements" element={<PlacementsPage />} />
              <Route path="/internship-advisor/evaluations" element={<EvaluationsPage />} />
              <Route path="/internship-advisor/calendar" element={<CalendarPage />} />
              <Route path="/internship-advisor/reports" element={<ReportsPage />} />
              <Route path="/internship-advisor/messages" element={<MessagesPage />} />
            </Route>
          </Route>

          {/* Evaluator routes */}
          <Route element={<ProtectedRoute allowedRoles={["internship_evaluator"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/internship-evaluator" element={<EvaluatorDashboard />} />
              <Route path="/internship-evaluator/evaluations" element={<EvaluationsPage />} />
              <Route path="/internship-evaluator/defense" element={<DefensePage />} />
              <Route path="/internship-evaluator/students" element={<StudentsPage />} />
              <Route path="/internship-evaluator/calendar" element={<CalendarPage />} />
              <Route path="/internship-evaluator/grades" element={<GradesPage />} />
              <Route path="/internship-evaluator/messages" element={<MessagesPage />} />
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
            </Route>
          </Route>

          {/* Shared authenticated routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/faq" element={<HelpPage />} />
              <Route path="/contact-support" element={<HelpPage />} />
              <Route path="/messages" element={<MessagesPage />} />
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
