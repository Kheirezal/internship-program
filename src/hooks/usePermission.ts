import { useAuthStore } from "@/stores/authStore";
import { ROLE_PERMISSIONS, type Permission, type UserRole } from "@/types";

export function usePermission() {
  const user = useAuthStore((s) => s.user);
  
  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role]?.includes(permission) ?? false;
  };

  const hasRole = (role: UserRole): boolean => user?.role === role;

  const hasAnyRole = (...roles: UserRole[]): boolean => !!user && roles.includes(user.role);

  return { hasPermission, hasRole, hasAnyRole, role: user?.role, user };
}
