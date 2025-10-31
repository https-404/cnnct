import api from './baseAxios.service';
import { ApiResponse } from '@/types/api-response.type';

export type Message = {
  id: string;
  text?: string;
  senderId: string;
  receiverId?: string;
  groupId?: string;
  createdAt: string;
  messageType: 'TEXT' | 'IMAGE' | 'VIDEO' | 'FILE' | 'AUDIO';
  attachments?: Array<{
    id: string;
    url: string;
    type: 'IMAGE' | 'VIDEO' | 'FILE' | 'AUDIO';
    sizeBytes?: number;
    width?: number;
    height?: number;
    durationMs?: number;
    fileName?: string;
  }>;
};

export type AttachmentUploadResponse = {
  url: string;
  type: 'IMAGE' | 'VIDEO' | 'FILE' | 'AUDIO';
  sizeBytes: number;
  width?: number;
  height?: number;
  durationMs?: number;
  fileName: string;
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

  async uploadAttachment(file: File): Promise<AttachmentUploadResponse> {
    const formData = new FormData();
    formData.append('attachment', file);
    
    const response = await api.post<ApiResponse<AttachmentUploadResponse>>('/message/attachment', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to upload attachment');
  },
};

