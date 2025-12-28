import apiClient from './client';

export interface Notification {
  id: number;
  userId: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationsService = {
  getByUserId: async (userId: number): Promise<Notification[]> => {
    const response = await apiClient.get<Notification[]>('/api/Notification', { params: { userId } });
    return response.data;
  },

  markAllAsRead: async (userId: number): Promise<void> => {
    await apiClient.put('/api/Notification/markAllasRead', null, { params: { userId } });
  },

  markAsRead: async (userId: number, notificationId: number): Promise<void> => {
    await apiClient.put('/api/Notification/markAsRead', null, { params: { userId, notificationId } });
  },
};
