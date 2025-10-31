import api from './baseAxios.service';
import { ApiResponse } from '@/types/api-response.type';
import { User } from '@/types/user.type';

// Map backend profilePicture to avatar
const mapUserResponse = (user: any): User => ({
  ...user,
  avatar: user.profilePicture || user.avatar || null,
});

export type FriendWithLastMessage = User & {
  lastMessage?: string;
  lastMessageTime?: string;
};

export const friendService = {
  async getFriends(): Promise<User[]> {
    const response = await api.get<ApiResponse<any[]>>('/friends');
    if (response.data.data) {
      return response.data.data.map(mapUserResponse);
    }
    throw new Error(response.data.message || 'Failed to fetch friends');
  },

  async removeFriend(userId: string): Promise<void> {
    await api.delete(`/friends/${userId}`);
  },
};

