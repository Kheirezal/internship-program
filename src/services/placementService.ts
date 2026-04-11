import type { Placement } from "@/types";
import { mockPlacements } from "@/data/mockData";

export const placementService = {
  getAll: async (): Promise<Placement[]> => mockPlacements,
  getById: async (id: string): Promise<Placement | undefined> => mockPlacements.find(p => p.id === id),
  create: async (data: Omit<Placement, "id">): Promise<Placement> => {
    const p: Placement = { ...data, id: "p" + Date.now() };
    mockPlacements.push(p);
    return p;
  },
  update: async (id: string, data: Partial<Placement>): Promise<Placement | undefined> => {
    const idx = mockPlacements.findIndex(p => p.id === id);
    if (idx === -1) return undefined;
    mockPlacements[idx] = { ...mockPlacements[idx], ...data };
    return mockPlacements[idx];
  },
  delete: async (id: string): Promise<boolean> => {
    const idx = mockPlacements.findIndex(p => p.id === id);
    if (idx === -1) return false;
    mockPlacements.splice(idx, 1);
    return true;
  },
};
