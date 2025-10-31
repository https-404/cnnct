import api from './baseAxios.service';
import { ApiResponse } from '@/types/api-response.type';
import { User } from '@/types/user.type';

export type FriendRequest = {
  id: string;
  requesterId: string;
  recipientId: string;
  requester?: User;
  recipient?: User;
  createdAt: string;
  status: string;
};

export type FriendRequestsResponse = {
  sent: FriendRequest[];
  received: FriendRequest[];
};

export const requestService = {
  async getRequests(): Promise<FriendRequestsResponse> {
    const response = await api.get<ApiResponse<FriendRequestsResponse>>('/requests');
    if (response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch requests');
  },

  async sendRequest(userId: string): Promise<FriendRequest> {
    const response = await api.post<ApiResponse<FriendRequest>>(`/requests/${userId}`);
    if (response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to send request');
  },

  async acceptRequest(requestId: string): Promise<void> {
    await api.post(`/requests/${requestId}/accept`);
  },

  async rejectRequest(requestId: string): Promise<void> {
    await api.post(`/requests/${requestId}/reject`);
  },

  async cancelRequest(requestId: string): Promise<void> {
    await api.post(`/requests/${requestId}/cancel`);
  },
};

