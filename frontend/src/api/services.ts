import api from './axios';

// Auth Services
export const authService = {
  register: (userData: any) => api.post('/auth/register', userData),
  login: (credentials: any) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// User Services
export const userService = {
  getProfile: (id: string) => api.get(`/users/${id}`),
  updateProfile: (data: any) => api.put('/users/profile', data),
};

// Activity Services
export const activityService = {
  getAll: (category = 'All', search = '') => 
    api.get(`/activities?category=${category}&search=${search}`),
  getById: (id: string) => api.get(`/activities/${id}`),
  create: (data: any) => api.post('/activities', data),
  join: (id: string) => api.post(`/activities/${id}/join`),
  leave: (id: string) => api.post(`/activities/${id}/leave`),
  addComment: (id: string, text: string) => api.post(`/activities/${id}/comment`, { text }),
};

// Chat Services
export const chatService = {
  getConversations: () => api.get('/chats'),
  getMessages: (chatId: string) => api.get(`/chats/${chatId}/messages`),
  sendMessage: (chatId: string, text: string) => api.post(`/chats/${chatId}/messages`, { text }),
  createOrGetChat: (targetUserId: string) => api.post('/chats', { targetUserId }),
};

// Upload Service
export const uploadService = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
