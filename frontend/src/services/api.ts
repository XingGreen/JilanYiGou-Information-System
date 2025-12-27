import axios from 'axios';
import type { AuthResponse, User, Idea, IdeaListResponse, IdeaResponse, TagListResponse, IdeaFilters } from '../types';

// 创建Axios实例
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器，添加认证令牌
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 认证服务
export const authService = {
  // 用户注册
  register: async (username: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/users/register', { username, email, password });
    return response.data;
  },
  
  // 用户登录
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/users/login', { email, password });
    return response.data;
  },
  
  // 获取当前用户信息
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
  }
};

// 思想服务
export const ideaService = {
  // 创建思想
  createIdea: async (idea: Omit<Idea, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'Tags'>): Promise<Idea> => {
    const response = await api.post<IdeaResponse>('/ideas', idea);
    return response.data.idea;
  },
  
  // 获取所有思想
  getAllIdeas: async (params?: IdeaFilters): Promise<Idea[]> => {
    const response = await api.get<IdeaListResponse>('/ideas', { params });
    return response.data.ideas;
  },
  
  // 获取单个思想
  getIdeaById: async (id: number): Promise<Idea> => {
    const response = await api.get<IdeaResponse>(`/ideas/${id}`);
    return response.data.idea;
  },
  
  // 更新思想
  updateIdea: async (id: number, idea: Partial<Idea>): Promise<Idea> => {
    const response = await api.put<IdeaResponse>(`/ideas/${id}`, idea);
    return response.data.idea;
  },
  
  // 删除思想
  deleteIdea: async (id: number): Promise<void> => {
    await api.delete(`/ideas/${id}`);
  },
  
  // 获取所有标签
  getAllTags: async (): Promise<TagListResponse> => {
    const response = await api.get<TagListResponse>('/ideas/tags/all');
    return response.data;
  }
};

export default api;