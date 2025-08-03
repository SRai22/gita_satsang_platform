import api from '../lib/api';
import {
  User,
  CreateUserData,
  LoginCredentials,
  AuthResponse,
  Discussion,
  CreateDiscussionData,
  Space,
  CreateSpaceData,
  Satsang,
  CreateSatsangData,
  LearningContent,
  Notification,
  DailyShloka,
  APIResponse,
  PaginatedResponse,
  DiscussionQueryParams,
  SatsangQueryParams,
  LearningQueryParams,
} from '../types/api';

// Authentication API
export const authAPI = {
  register: async (userData: CreateUserData): Promise<APIResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  googleLogin: async (googleToken: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/google', { googleToken });
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<{ token: string; refreshToken: string }> => {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    return response.data;
  },

  getProfile: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  logout: async (): Promise<APIResponse> => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  forgotPassword: async (email: string): Promise<APIResponse> => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, password: string): Promise<APIResponse> => {
    const response = await api.put(`/auth/reset-password/${token}`, { password });
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getPendingApprovals: async (): Promise<{ users: User[] }> => {
    const response = await api.get('/users/pending-approvals');
    return response.data;
  },

  approveUser: async (userId: string, role: string): Promise<APIResponse> => {
    const response = await api.post(`/users/${userId}/approve`, { role });
    return response.data;
  },

  updateUserRole: async (userId: string, role: string): Promise<APIResponse> => {
    const response = await api.put(`/users/${userId}/role`, { role });
    return response.data;
  },

  getUserProfile: async (userId: string): Promise<{ user: User }> => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  updateProfile: async (profileData: Partial<User>): Promise<{ user: User }> => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },
};

// Discussions API
export const discussionsAPI = {
  list: async (params?: DiscussionQueryParams): Promise<PaginatedResponse<Discussion>> => {
    const response = await api.get('/discussions', { params });
    return response.data;
  },

  create: async (discussionData: CreateDiscussionData): Promise<{ discussion: Discussion }> => {
    const response = await api.post('/discussions', discussionData);
    return response.data;
  },

  getById: async (id: string): Promise<{ discussion: Discussion }> => {
    const response = await api.get(`/discussions/${id}`);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateDiscussionData>): Promise<{ discussion: Discussion }> => {
    const response = await api.put(`/discussions/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<APIResponse> => {
    const response = await api.delete(`/discussions/${id}`);
    return response.data;
  },

  addReaction: async (id: string, type: string): Promise<APIResponse> => {
    const response = await api.post(`/discussions/${id}/reactions`, { type });
    return response.data;
  },

  getComments: async (id: string): Promise<{ comments: Comment[] }> => {
    const response = await api.get(`/discussions/${id}/comments`);
    return response.data;
  },

  addComment: async (id: string, content: string, parentId?: string): Promise<APIResponse> => {
    const response = await api.post(`/discussions/${id}/comments`, { content, parentId });
    return response.data;
  },
};

// Spaces API
export const spacesAPI = {
  list: async (): Promise<{ spaces: Space[] }> => {
    const response = await api.get('/spaces');
    return response.data;
  },

  create: async (spaceData: CreateSpaceData): Promise<{ space: Space }> => {
    const response = await api.post('/spaces', spaceData);
    return response.data;
  },

  getById: async (id: string): Promise<{ space: Space }> => {
    const response = await api.get(`/spaces/${id}`);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateSpaceData>): Promise<{ space: Space }> => {
    const response = await api.put(`/spaces/${id}`, data);
    return response.data;
  },

  join: async (id: string, message?: string): Promise<APIResponse> => {
    const response = await api.post(`/spaces/${id}/join`, { message });
    return response.data;
  },

  leave: async (id: string): Promise<APIResponse> => {
    const response = await api.post(`/spaces/${id}/leave`);
    return response.data;
  },

  getMembers: async (id: string): Promise<{ members: User[] }> => {
    const response = await api.get(`/spaces/${id}/members`);
    return response.data;
  },

  getPosts: async (id: string): Promise<{ posts: any[] }> => {
    const response = await api.get(`/spaces/${id}/posts`);
    return response.data;
  },

  createPost: async (id: string, postData: any): Promise<APIResponse> => {
    const response = await api.post(`/spaces/${id}/posts`, postData);
    return response.data;
  },
};

// Satsangs API
export const satsangsAPI = {
  list: async (params?: SatsangQueryParams): Promise<{ satsangs: Satsang[] }> => {
    const response = await api.get('/satsangs', { params });
    return response.data;
  },

  create: async (satsangData: CreateSatsangData): Promise<{ satsang: Satsang }> => {
    const response = await api.post('/satsangs', satsangData);
    return response.data;
  },

  getById: async (id: string): Promise<{ satsang: Satsang }> => {
    const response = await api.get(`/satsangs/${id}`);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateSatsangData>): Promise<{ satsang: Satsang }> => {
    const response = await api.put(`/satsangs/${id}`, data);
    return response.data;
  },

  register: async (id: string, message?: string): Promise<APIResponse> => {
    const response = await api.post(`/satsangs/${id}/register`, { message });
    return response.data;
  },

  start: async (id: string): Promise<APIResponse> => {
    const response = await api.post(`/satsangs/${id}/start`);
    return response.data;
  },

  getRecordings: async (id: string): Promise<{ recordings: any[] }> => {
    const response = await api.get(`/satsangs/${id}/recordings`);
    return response.data;
  },
};

// Learning API
export const learningAPI = {
  getContent: async (params?: LearningQueryParams): Promise<{ content: LearningContent[] }> => {
    const response = await api.get('/learning/content', { params });
    return response.data;
  },

  createContent: async (contentData: any): Promise<{ content: LearningContent }> => {
    const response = await api.post('/learning/content', contentData);
    return response.data;
  },

  getContentById: async (id: string): Promise<{ content: LearningContent }> => {
    const response = await api.get(`/learning/content/${id}`);
    return response.data;
  },

  updateContent: async (id: string, data: any): Promise<{ content: LearningContent }> => {
    const response = await api.put(`/learning/content/${id}`, data);
    return response.data;
  },

  deleteContent: async (id: string): Promise<APIResponse> => {
    const response = await api.delete(`/learning/content/${id}`);
    return response.data;
  },

  recordView: async (id: string): Promise<APIResponse> => {
    const response = await api.post(`/learning/content/${id}/view`);
    return response.data;
  },
};

// Notifications API
export const notificationsAPI = {
  list: async (): Promise<{ notifications: Notification[] }> => {
    const response = await api.get('/notifications');
    return response.data;
  },

  markAsRead: async (id: string): Promise<APIResponse> => {
    const response = await api.post(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<APIResponse> => {
    const response = await api.post('/notifications/read-all');
    return response.data;
  },

  updateSettings: async (settings: any): Promise<APIResponse> => {
    const response = await api.post('/notifications/settings', settings);
    return response.data;
  },
};

// Shloka API
export const shlokaAPI = {
  getToday: async (): Promise<{ shloka: DailyShloka }> => {
    const response = await api.get('/shloka/today');
    return response.data;
  },

  getRandom: async (): Promise<{ shloka: DailyShloka }> => {
    const response = await api.get('/shloka/random');
    return response.data;
  },

  getByChapter: async (chapter: string): Promise<{ shlokas: DailyShloka[] }> => {
    const response = await api.get(`/shloka/chapter/${chapter}`);
    return response.data;
  },
};

// Files API
export const filesAPI = {
  upload: async (file: File, type: string): Promise<{ fileId: string; url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
