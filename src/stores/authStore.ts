import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserRole } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User) => void;
  updateTheme: (theme: "light" | "dark", colorTheme: string) => Promise<void>;
}

const MOCK_USERS: Record<string, { password: string; user: User }> = {
  "coordinator@imem.edu": {
    password: "password",
    user: { id: "u1", email: "coordinator@imem.edu", name: "Dr. Sarah Chen", role: "internship_coordinator", department: "Computer Science", avatar: "" },
  },
  "advisor@imem.edu": {
    password: "password",
    user: { id: "u2", email: "advisor@imem.edu", name: "Prof. James Wilson", role: "internship_advisor", department: "Information Systems", avatar: "" },
  },
  "evaluator@imem.edu": {
    password: "password",
    user: { id: "u3", email: "evaluator@imem.edu", name: "Dr. Maria Garcia", role: "internship_evaluator", department: "Software Engineering", avatar: "" },
  },
  "supervisor@company.com": {
    password: "password",
    user: { id: "u4", email: "supervisor@company.com", name: "Michael Brown", role: "company_supervisor", department: "Engineering", avatar: "" },
  },
  "student@imem.edu": {
    password: "password",
    user: { id: "u5", email: "student@imem.edu", name: "Alex Johnson", role: "internship_student", department: "Computer Science", avatar: "" },
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        await new Promise((r) => setTimeout(r, 800));
        const entry = MOCK_USERS[email];
        if (entry && entry.password === password) {
          set({ user: entry.user, token: "mock-jwt-token-" + Date.now(), isAuthenticated: true });
          return true;
        }
        return false;
      },
      register: async (name: string, email: string, _password: string, role: UserRole) => {
        await new Promise((r) => setTimeout(r, 800));
        const user: User = { id: "u" + Date.now(), email, name, role };
        set({ user, token: "mock-jwt-token-" + Date.now(), isAuthenticated: true });
        return true;
      },
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      setUser: (user) => set({ user }),
      updateTheme: async (theme, colorTheme) => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, theme, colorTheme };
          set({ user: updatedUser });
          // Call service (mocked)
          const { authService } = await import("@/services/authService");
          await authService.updateTheme(theme, colorTheme);
        }
      },
    }),
    { name: "imem-auth" }
  )
);
