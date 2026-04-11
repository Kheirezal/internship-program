import type { Company } from "@/types";
import { mockCompanies } from "@/data/mockData";

export const companyService = {
  getAll: async (): Promise<Company[]> => {
    // Replace with: fetch(`${API_BASE}/companies`)
    return mockCompanies;
  },
  getById: async (id: string): Promise<Company | undefined> => {
    return mockCompanies.find(c => c.id === id);
  },
  create: async (data: Omit<Company, "id">): Promise<Company> => {
    const newCompany: Company = { ...data, id: "c" + Date.now() };
    mockCompanies.push(newCompany);
    return newCompany;
  },
  update: async (id: string, data: Partial<Company>): Promise<Company | undefined> => {
    const idx = mockCompanies.findIndex(c => c.id === id);
    if (idx === -1) return undefined;
    mockCompanies[idx] = { ...mockCompanies[idx], ...data };
    return mockCompanies[idx];
  },
  delete: async (id: string): Promise<boolean> => {
    const idx = mockCompanies.findIndex(c => c.id === id);
    if (idx === -1) return false;
    mockCompanies.splice(idx, 1);
    return true;
  },
};
