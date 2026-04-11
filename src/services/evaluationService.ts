import type { Evaluation } from "@/types";
import { mockEvaluations } from "@/data/mockData";

export const evaluationService = {
  getAll: async (): Promise<Evaluation[]> => mockEvaluations,
  getByPlacement: async (placementId: string): Promise<Evaluation[]> => mockEvaluations.filter(e => e.placementId === placementId),
  create: async (data: Omit<Evaluation, "id">): Promise<Evaluation> => {
    const e: Evaluation = { ...data, id: "e" + Date.now() };
    mockEvaluations.push(e);
    return e;
  },
  update: async (id: string, data: Partial<Evaluation>): Promise<Evaluation | undefined> => {
    const idx = mockEvaluations.findIndex(e => e.id === id);
    if (idx === -1) return undefined;
    mockEvaluations[idx] = { ...mockEvaluations[idx], ...data };
    return mockEvaluations[idx];
  },
  finalize: async (id: string): Promise<Evaluation | undefined> => {
    const idx = mockEvaluations.findIndex(e => e.id === id);
    if (idx === -1) return undefined;
    mockEvaluations[idx] = { ...mockEvaluations[idx], status: "finalized" };
    return mockEvaluations[idx];
  },
};
