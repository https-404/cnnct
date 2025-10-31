import api from './baseAxios.service';
import { ApiResponse } from '@/types/api-response.type';
import { User } from '@/types/user.type';

// Map backend profilePicture to avatar
const mapUserResponse = (user: any): User => ({
  ...user,
  avatar: user.profilePicture || user.avatar || null,
});

export const userService = {
  async searchUsers(query: string): Promise<User[]> {
    // Note: This endpoint doesn't exist yet, we'll need to create it
    // For now, we'll use a placeholder that returns empty array
    // You can create this endpoint in the backend later
    try {
      const response = await api.get<ApiResponse<any[]>>(`/user/search?q=${encodeURIComponent(query)}`);
      if (response.data.data) {
        return response.data.data.map(mapUserResponse);
      }
    } catch (error) {
      // Endpoint might not exist yet
      console.warn('User search endpoint not available');
    }
    return [];
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<any>>('/user/me');
    if (response.data.data) {
      return mapUserResponse(response.data.data);
    }
    throw new Error(response.data.message || 'Failed to fetch user');
  },

  async getUserProfile(userId: string): Promise<User> {
    // This might not exist, but we can use it if needed
    const response = await api.get<ApiResponse<any>>(`/user/${userId}`);
    if (response.data.data) {
      return mapUserResponse(response.data.data);
    }
    throw new Error(response.data.message || 'Failed to fetch user profile');
  },

  async updateProfile(data: { username?: string; email?: string; phoneNumber?: string }): Promise<User> {
    const response = await api.patch<ApiResponse<any>>('/user/me', data);
    if (response.data.data) {
      return mapUserResponse(response.data.data);
    }
    throw new Error(response.data.message || 'Failed to update profile');
  },

  async uploadProfilePicture(file: File): Promise<User> {
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    const response = await api.post<ApiResponse<any>>('/user/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.data) {
      return mapUserResponse(response.data.data);
    }
    throw new Error(response.data.message || 'Failed to upload profile picture');
  },
};

