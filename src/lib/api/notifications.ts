import apiClient from './client';

export interface NotificationDetail {
  id: number;
  title: string;
  message: string;
  type: string;
  category: string;
  createdAt: string;
  userNotifications: any[];
}

export interface Notification {
  id: number;
  userId: number;
  notificationId: number;
  notification: NotificationDetail;
  isRead: boolean;
}

export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
}

export const notificationsService = {
  getByUserId: async (userId: number): Promise<Notification[]> => {
    const response = await apiClient.get<Notification[]>('/api/Notification', { 
      params: { userId } 
    });
    return response.data;
  },

  markAllAsRead: async (userId: number): Promise<void> => {
    await apiClient.put('/api/Notification/MarkAllasRead', null, { 
      params: { userId } 
    });
  },

  markAsRead: async (userId: number, notificationId: number): Promise<void> => {
    await apiClient.put('/api/Notification/MarkAsRead', null, { 
      params: { userId, notificationId } 
    });
  },

  // Optional: Get notifications with unread count
  getNotificationsWithCount: async (userId: number): Promise<NotificationResponse> => {
    const notifications = await notificationsService.getByUserId(userId);
    const unreadCount = notifications.filter(n => !n.isRead).length;
    
    return {
      notifications,
      unreadCount
    };
  }
};