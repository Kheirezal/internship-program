import type { Logbook } from "@/types";
import { mockLogbooks } from "@/data/mockData";

export const logbookService = {
  getAll: async (): Promise<Logbook[]> => mockLogbooks,
  getByStudent: async (studentId: string): Promise<Logbook[]> => mockLogbooks.filter(l => l.studentId === studentId),
  create: async (data: Omit<Logbook, "id">): Promise<Logbook> => {
    const l: Logbook = { ...data, id: "l" + Date.now() };
    mockLogbooks.push(l);
    return l;
  },
  approve: async (id: string, feedback: string, reviewedBy: string): Promise<Logbook | undefined> => {
    const idx = mockLogbooks.findIndex(l => l.id === id);
    if (idx === -1) return undefined;
    mockLogbooks[idx] = { ...mockLogbooks[idx], status: "approved", feedback, reviewedBy };
    return mockLogbooks[idx];
  },
  reject: async (id: string, feedback: string, reviewedBy: string): Promise<Logbook | undefined> => {
    const idx = mockLogbooks.findIndex(l => l.id === id);
    if (idx === -1) return undefined;
    mockLogbooks[idx] = { ...mockLogbooks[idx], status: "rejected", feedback, reviewedBy };
    return mockLogbooks[idx];
  },
};
