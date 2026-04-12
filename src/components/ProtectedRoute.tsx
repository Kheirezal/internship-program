import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useNotificationStore } from "@/stores/notificationStore";
import type { UserRole } from "@/types";
import { useEffect } from "react";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children?: React.ReactNode;
}

export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const generateAutoNotifications = useNotificationStore((s) => s.generateAutoNotifications);

  useEffect(() => {
    if (isAuthenticated && user) {
      generateAutoNotifications(user);
    }
  }, [isAuthenticated, user, generateAutoNotifications]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role.replace("_", "-")}`} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
