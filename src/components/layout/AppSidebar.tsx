import { useAuthStore } from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";
import type { UserRole } from "@/types";
import { NavLink, useLocation } from "react-router-dom";
import {
  Building2, Users, ClipboardList, BookOpen, CheckSquare, Calendar,
  MessageSquare, BarChart3, FileText, Star, GraduationCap, AlertCircle,
  Home, UserCheck, Clock, Upload, HelpCircle, Briefcase, Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  internship_coordinator: [
    { label: "Dashboard", path: "/internship-coordinator", icon: Home },
    { label: "Companies", path: "/internship-coordinator/companies", icon: Building2 },
    { label: "Placements", path: "/internship-coordinator/placements", icon: Briefcase },
    { label: "Students", path: "/internship-coordinator/students", icon: GraduationCap },
    { label: "Evaluations", path: "/internship-coordinator/evaluations", icon: Star },
    { label: "Calendar", path: "/internship-coordinator/calendar", icon: Calendar },
    { label: "Reports", path: "/internship-coordinator/reports", icon: BarChart3 },
    { label: "Complaints", path: "/internship-coordinator/complaints", icon: AlertCircle },
    { label: "Messages", path: "/internship-coordinator/messages", icon: MessageSquare },
  ],
  internship_advisor: [
    { label: "Dashboard", path: "/internship-advisor", icon: Home },
    { label: "Students", path: "/internship-advisor/students", icon: Users },
    { label: "Logbooks", path: "/internship-advisor/logbooks", icon: BookOpen },
    { label: "Placements", path: "/internship-advisor/placements", icon: Briefcase },
    { label: "Evaluations", path: "/internship-advisor/evaluations", icon: Star },
    { label: "Calendar", path: "/internship-advisor/calendar", icon: Calendar },
    { label: "Reports", path: "/internship-advisor/reports", icon: FileText },
    { label: "Messages", path: "/internship-advisor/messages", icon: MessageSquare },
  ],
  internship_evaluator: [
    { label: "Dashboard", path: "/internship-evaluator", icon: Home },
    { label: "Evaluations", path: "/internship-evaluator/evaluations", icon: Star },
    { label: "Defense", path: "/internship-evaluator/defense", icon: Target },
    { label: "Students", path: "/internship-evaluator/students", icon: Users },
    { label: "Calendar", path: "/internship-evaluator/calendar", icon: Calendar },
    { label: "Grades", path: "/internship-evaluator/grades", icon: BarChart3 },
    { label: "Messages", path: "/internship-evaluator/messages", icon: MessageSquare },
  ],
  company_supervisor: [
    { label: "Dashboard", path: "/company-supervisor", icon: Home },
    { label: "Interns", path: "/company-supervisor/interns", icon: Users },
    { label: "Attendance", path: "/company-supervisor/attendance", icon: Clock },
    { label: "Tasks", path: "/company-supervisor/tasks", icon: CheckSquare },
    { label: "Logbooks", path: "/company-supervisor/logbooks", icon: BookOpen },
    { label: "Evaluation", path: "/company-supervisor/evaluation", icon: Star },
    { label: "Messages", path: "/company-supervisor/messages", icon: MessageSquare },
  ],
  internship_student: [
    { label: "Dashboard", path: "/internship-student", icon: Home },
    { label: "Internship", path: "/internship-student/internship", icon: Briefcase },
    { label: "Logbooks", path: "/internship-student/logbooks", icon: BookOpen },
    { label: "Documents", path: "/internship-student/documents", icon: FileText },
    { label: "Tasks", path: "/internship-student/tasks", icon: CheckSquare },
    { label: "Grades", path: "/internship-student/grades", icon: BarChart3 },
    { label: "Complaints", path: "/internship-student/complaints", icon: AlertCircle },
    { label: "Messages", path: "/internship-student/messages", icon: MessageSquare },
  ],
};

export default function AppSidebar() {
  const { user } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const location = useLocation();

  if (!user) return null;

  const items = NAV_ITEMS[user.role] || [];

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 border-r bg-card transition-transform duration-300 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <div className="gradient-primary text-primary-foreground font-bold text-sm px-2.5 py-1 rounded-lg">IMEM</div>
          <span className="font-semibold text-sm text-primary">Internship</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "gradient-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t p-3">
          <NavLink
            to="/help"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
            Help & Support
          </NavLink>
        </div>
      </aside>
    </>
  );
}
