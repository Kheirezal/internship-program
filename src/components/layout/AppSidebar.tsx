import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";
import type { UserRole } from "@/types";
import { NavLink, useLocation } from "react-router-dom";
import {
  Building2, Users, ClipboardList, BookOpen, CheckSquare, Calendar,
  MessageSquare, BarChart3, FileText, Star, GraduationCap, AlertCircle,
  Home, UserCheck, Clock, Upload, HelpCircle, Briefcase, Target, ChevronRight, Shield,
  Megaphone, BookMarked, TrendingUp, MapPin, Scale, Calculator, Award, Send, Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  children?: { label: string; path: string; icon: React.ElementType }[];
}

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  internship_coordinator: [
    { label: "Dashboard", path: "/internship-coordinator", icon: Home },
    { label: "Companies", path: "/internship-coordinator/companies", icon: Building2 },
    { label: "Placements", path: "/internship-coordinator/placements", icon: Briefcase },
    { label: "Applications", path: "/internship-coordinator/applications", icon: Send },
    { label: "Students", path: "/internship-coordinator/students", icon: GraduationCap },
    { label: "Evaluations", path: "/internship-coordinator/evaluations", icon: Star },
    { label: "Rubric Config", path: "/internship-coordinator/rubric", icon: Scale },
    { label: "Grade Calculation", path: "/internship-coordinator/grades", icon: Calculator },
    { label: "Site Visits", path: "/internship-coordinator/site-visits", icon: MapPin },
    { label: "Documents", path: "/internship-coordinator/documents", icon: FileText },
    { label: "Calendar", path: "/internship-coordinator/calendar", icon: Calendar },
    { label: "Reports", path: "/internship-coordinator/reports", icon: BarChart3 },
    { label: "Complaints", path: "/internship-coordinator/complaints", icon: AlertCircle },
    { label: "Messages", path: "/internship-coordinator/messages", icon: MessageSquare },
    { label: "User Management", path: "/internship-coordinator/users", icon: Users },
  ],
  internship_advisor: [
    { 
      label: "Advisor", 
      path: "#", 
      icon: UserCheck,
      children: [
        { label: "Dashboard", path: "/internship-advisor", icon: Home },
        { label: "Students", path: "/internship-advisor/students", icon: Users },
        { label: "Logbooks", path: "/internship-advisor/logbooks", icon: BookOpen },
        { label: "Placements", path: "/internship-advisor/placements", icon: Briefcase },
        { label: "Site Visits", path: "/internship-advisor/site-visits", icon: MapPin },
        { label: "Evaluations", path: "/internship-advisor/evaluations", icon: Star },
        { label: "Attendance", path: "/internship-advisor/attendance", icon: Clock },
        { label: "Reports", path: "/internship-advisor/reports", icon: FileText },
        { label: "Calendar", path: "/internship-advisor/calendar", icon: Calendar },
        { label: "Messages", path: "/internship-advisor/messages", icon: MessageSquare },
      ]
    },
    { 
      label: "Evaluator", 
      path: "#", 
      icon: Star,
      children: [
        { label: "Dashboard", path: "/internship-advisor", icon: Home },
        { label: "Evaluations", path: "/internship-advisor/evaluations", icon: Star },
        { label: "Defense", path: "/internship-advisor/defense", icon: Target },
        { label: "Students", path: "/internship-advisor/students", icon: Users },
        { label: "Grades", path: "/internship-advisor/grades", icon: BarChart3 },
        { label: "Calendar", path: "/internship-advisor/calendar", icon: Calendar },
        { label: "Messages", path: "/internship-advisor/messages", icon: MessageSquare },
      ]
    },
  ],
  department_head: [
    { 
      label: "Department Head", 
      path: "#", 
      icon: Shield,
      children: [
        { label: "Dashboard", path: "/department-head", icon: Home },
        { label: "Grade Approval", path: "/department-head/grades", icon: CheckSquare },
        { label: "Student Management", path: "/department-head/students", icon: GraduationCap },
        { label: "User Management", path: "/department-head/users", icon: Users },
        { label: "Partner Companies", path: "/department-head/companies", icon: Building2 },
        { label: "Announcements", path: "/department-head/announcements", icon: Megaphone },
        { label: "Orientation", path: "/department-head/orientation", icon: BookMarked },
        { label: "Evaluations", path: "/department-head/evaluations", icon: Star },
        { label: "Defenses", path: "/department-head/defense", icon: Target },
        { label: "Calendar", path: "/department-head/calendar", icon: Calendar },
        { label: "Oversight Reports", path: "/department-head/reports", icon: BarChart3 },
        { label: "Examinations", path: "/department-head/exams", icon: FileText },
        { label: "Gap Analysis", path: "/department-head/gap-analysis", icon: TrendingUp },
        { label: "Messages", path: "/department-head/messages", icon: MessageSquare },
      ]
    },
  ],
  company_supervisor: [
    { label: "Dashboard", path: "/company-supervisor", icon: Home },
    { label: "Interns", path: "/company-supervisor/interns", icon: Users },
    { label: "Attendance", path: "/company-supervisor/attendance", icon: Clock },
    { label: "Tasks", path: "/company-supervisor/tasks", icon: CheckSquare },
    { label: "Logbooks", path: "/company-supervisor/logbooks", icon: BookOpen },
    { label: "Evaluation", path: "/company-supervisor/evaluation", icon: Star },
    { label: "Recommendations", path: "/company-supervisor/recommendations", icon: Award },
    { label: "Messages", path: "/company-supervisor/messages", icon: MessageSquare },
  ],
  internship_student: [
    { label: "Dashboard", path: "/internship-student", icon: Home },
    { label: "Apply", path: "/internship-student/apply", icon: Send },
    { label: "Internship", path: "/internship-student/internship", icon: Briefcase },
    { label: "Logbooks", path: "/internship-student/logbooks", icon: BookOpen },
    { label: "Documents", path: "/internship-student/documents", icon: FileText },
    { label: "Tasks", path: "/internship-student/tasks", icon: CheckSquare },
    { label: "Attendance", path: "/internship-student/attendance", icon: Clock },
    { label: "Examinations", path: "/internship-student/exams", icon: FileText },
    { label: "Grades", path: "/internship-student/grades", icon: BarChart3 },
    { label: "Defense", path: "/internship-student/defense", icon: Target },
    { label: "Complaints", path: "/internship-student/complaints", icon: AlertCircle },
    { label: "Messages", path: "/internship-student/messages", icon: MessageSquare },
  ],
};

export default function AppSidebar() {
  const { user } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(() => {
    if (location.pathname.startsWith("/internship-advisor")) return "Advisor";
    if (location.pathname.startsWith("/department-head")) return "Department Head";
    return null;
  });

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
            const hasChildren = item.children && item.children.length > 0;
            const isSubmenuOpen = openSubmenu === item.label;
            const isActive = location.pathname === item.path || (hasChildren && item.children?.some(c => location.pathname === c.path));

            if (hasChildren) {
              return (
                <div key={item.label} className="space-y-1">
                  <button
                    onClick={() => setOpenSubmenu(isSubmenuOpen ? null : item.label)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive 
                        ? "text-primary bg-primary/5" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {item.label}
                    </div>
                    <motion.div
                      animate={{ rotate: isSubmenuOpen ? 90 : 0 }}
                      className="text-muted-foreground/50"
                    >
                      <ChevronRight className="h-3 w-3" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {isSubmenuOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-4 space-y-1"
                      >
                        {item.children?.map((child) => (
                          <NavLink
                            key={child.path}
                            to={child.path}
                            onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                            className={({ isActive }) => cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                              isActive
                                ? "text-primary font-bold"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                          >
                            <child.icon className="h-4 w-4" />
                            {child.label}
                          </NavLink>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "text-primary bg-primary/5 font-bold"
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

