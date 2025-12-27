// 用户类型
export interface User {
  id: number;
  username: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

// 标签类型
export interface Tag {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

// 思想类型
export interface Idea {
  id: number;
  title: string;
  content: string;
  category?: string;
  status: 'draft' | 'active' | 'completed';
  importance?: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  Tags?: Tag[];
  tags?: string[]; // 用于创建/更新时的标签名称数组
}

// 认证响应类型
export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

// 思想列表响应类型
export interface IdeaListResponse {
  ideas: Idea[];
}

// 思想响应类型
export interface IdeaResponse {
  idea: Idea;
}

// 标签列表响应类型
export interface TagListResponse {
  tags: Tag[];
}

// 认证上下文类型
export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// 筛选条件类型
export interface IdeaFilters {
  category?: string;
  status?: string;
  importance?: number;
  tag?: string;
  search?: string;
}