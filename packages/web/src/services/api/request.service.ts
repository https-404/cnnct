import api from './baseAxios.service';
import { ApiResponse } from '@/types/api-response.type';
import { User } from '@/types/user.type';

// Map backend profilePicture to avatar
const mapUserResponse = (user: any): User => ({
  ...user,
  avatar: user.profilePicture || user.avatar || null,
});

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

// Map friend request data
const mapFriendRequest = (request: any): FriendRequest => ({
  ...request,
  requester: request.requester ? mapUserResponse(request.requester) : undefined,
  recipient: request.recipient ? mapUserResponse(request.recipient) : undefined,
});

export const requestService = {
  async getRequests(): Promise<FriendRequestsResponse> {
    const response = await api.get<ApiResponse<any>>('/requests');
    if (response.data.data) {
      return {
        sent: response.data.data.sent?.map(mapFriendRequest) || [],
        received: response.data.data.received?.map(mapFriendRequest) || [],
      };
    }
    throw new Error(response.data.message || 'Failed to fetch requests');
  },

  async sendRequest(userId: string): Promise<FriendRequest> {
    const response = await api.post<ApiResponse<any>>(`/requests/${userId}`);
    if (response.data.data) {
      return mapFriendRequest(response.data.data);
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

