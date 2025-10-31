import api from './baseAxios.service';
import { ApiResponse } from '@/types/api-response.type';

export type Message = {
  id: string;
  text?: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  messageType: string;
  attachments?: Array<{
    id: string;
    url: string;
    type: string;
  }>;
};

export const messageService = {
  async getMessages(userId: string, page: number = 1, pageSize: number = 20): Promise<Message[]> {
    const response = await api.get<ApiResponse<Message[]>>(`/message/${userId}?page=${page}&pageSize=${pageSize}`);
    if (response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch messages');
  },

  async deleteMessage(messageId: string): Promise<void> {
    await api.delete(`/message/${messageId}`);
  },
};

