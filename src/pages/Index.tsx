import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export default function Index() {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    return <Navigate to={`/${user.role.replace(/_/g, "-")}`} replace />;
  }

  return <Navigate to="/login" replace />;
}
