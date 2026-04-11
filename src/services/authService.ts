import type { User, UserRole } from "@/types";

const API_BASE = "/api";

export const authService = {
  login: async (email: string, password: string): Promise<{ user: User; token: string } | null> => {
    // Mock: replace with real API call
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).catch(() => null);
    if (!res) return null;
    return res.json();
  },

  register: async (data: { name: string; email: string; password: string; role: UserRole }): Promise<{ user: User; token: string } | null> => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch(() => null);
    if (!res) return null;
    return res.json();
  },

  forgotPassword: async (email: string): Promise<boolean> => {
    await fetch(`${API_BASE}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => null);
    return true;
  },

  resetPassword: async (token: string, password: string): Promise<boolean> => {
    await fetch(`${API_BASE}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    }).catch(() => null);
    return true;
  },

  getProfile: async (): Promise<User | null> => {
    const res = await fetch(`${API_BASE}/auth/profile`).catch(() => null);
    if (!res) return null;
    return res.json();
  },

  updateProfile: async (data: Partial<User>): Promise<User | null> => {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch(() => null);
    if (!res) return null;
    return res.json();
  },

  updateTheme: async (theme: "light" | "dark", colorTheme: string): Promise<boolean> => {
    // Mock: PATCH /users/profile/theme
    await fetch(`${API_BASE}/users/profile/theme`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme, colorTheme }),
    }).catch(() => null);
    return true;
  },
};
