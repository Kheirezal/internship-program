import type { Message } from "@/types";
import { mockMessages } from "@/data/mockData";

export const messageService = {
  getAll: async (userId: string): Promise<Message[]> => mockMessages.filter(m => m.senderId === userId || m.receiverId === userId),
  getInbox: async (userId: string): Promise<Message[]> => mockMessages.filter(m => m.receiverId === userId),
  getSent: async (userId: string): Promise<Message[]> => mockMessages.filter(m => m.senderId === userId),
  send: async (data: Omit<Message, "id" | "createdAt" | "read">): Promise<Message> => {
    const m: Message = { ...data, id: "m" + Date.now(), createdAt: new Date().toISOString(), read: false };
    mockMessages.push(m);
    return m;
  },
  markAsRead: async (id: string): Promise<void> => {
    const idx = mockMessages.findIndex(m => m.id === id);
    if (idx !== -1) mockMessages[idx].read = true;
  },
};
