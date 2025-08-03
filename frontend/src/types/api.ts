// User Types
export interface User {
  id: string;
  email: string;
  fullName: string;
  spiritualName?: string;
  role: 'admin' | 'teacher' | 'learner';
  isApproved: boolean;
  isActive: boolean;
  avatar?: string;
  bio?: string;
  joinedAt: string;
  lastActive: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  fullName: string;
  spiritualName?: string;
  phone?: string;
  introduction?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
  refreshToken: string;
}

// Discussion Types
export interface Discussion {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    spiritualName: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  reactions: {
    like: number;
    love: number;
    wisdom: number;
    om: number;
  };
  commentsCount: number;
  isSticky: boolean;
}

export interface CreateDiscussionData {
  title: string;
  content: string;
  category: string;
  tags?: string[];
  attachments?: string[];
}

// Space Types
export interface Space {
  id: string;
  name: string;
  description: string;
  teacher: {
    id: string;
    spiritualName: string;
    avatar?: string;
  };
  isPrivate: boolean;
  memberCount: number;
  whatsappLink?: string;
  createdAt: string;
  lastActivity: string;
}

export interface CreateSpaceData {
  name: string;
  description: string;
  isPrivate: boolean;
  whatsappLink?: string;
  maxMembers?: number;
}

// Satsang Types
export interface Satsang {
  id: string;
  title: string;
  description: string;
  teacher: {
    id: string;
    spiritualName: string;
    avatar?: string;
  };
  scheduledAt: string;
  duration: number; // in minutes
  zoomMeetingId?: string;
  zoomPassword?: string;
  zoomJoinUrl?: string;
  maxParticipants?: number;
  registeredCount: number;
  isRecurring: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
}

export interface CreateSatsangData {
  title: string;
  description: string;
  scheduledAt: string;
  duration: number;
  maxParticipants?: number;
  isRecurring?: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  zoomSettings?: {
    password?: string;
    waitingRoom?: boolean;
    recording?: boolean;
  };
}

// Learning Content Types
export interface LearningContent {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'audio' | 'video';
  category: 'gita' | 'vedanta' | 'meditation' | 'prayer';
  teacher: {
    id: string;
    spiritualName: string;
  };
  fileUrl: string;
  duration?: number; // for audio/video in seconds
  downloadUrl?: string;
  createdAt: string;
  views: number;
  likes: number;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'satsang_reminder' | 'new_discussion' | 'space_update' | 'approval';
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

// Daily Shloka Types
export interface DailyShloka {
  id: string;
  sanskrit: string;
  translation: string;
  commentary: string;
  chapter: string;
  verse: string;
  source: string;
  date: string;
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Query Parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface DiscussionQueryParams extends PaginationParams {
  category?: string;
  search?: string;
}

export interface SatsangQueryParams extends PaginationParams {
  upcoming?: boolean;
  teacher?: string;
  from_date?: string;
  to_date?: string;
}

export interface LearningQueryParams extends PaginationParams {
  type?: 'pdf' | 'audio' | 'video';
  category?: 'gita' | 'vedanta' | 'meditation' | 'prayer';
  teacher?: string;
  search?: string;
}
