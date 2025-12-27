import api from "./axios";

const BASE_PATH = "/api/Notification";

export const getUserNotifications = (userId) => api.get(`${BASE_PATH}/user/${userId}`);

export const markAsRead = (notificationId) => 
  api.put(`${BASE_PATH}/markAsRead/${notificationId}`);

export const sendNotification = (data) => api.post(BASE_PATH, data);