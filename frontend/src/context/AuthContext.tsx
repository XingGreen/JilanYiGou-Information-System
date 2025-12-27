import React, { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType, User } from '../types';
import { authService } from '../services/api';

// 创建认证上下文
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: () => {}
});

// 认证上下文提供者组件
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(true);

  // 初始化时检查认证状态
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // 验证令牌有效性
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
          setToken(storedToken);
        } catch {
          // 令牌无效或过期，清除本地存储
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // 登录方法
  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    localStorage.setItem('token', response.token);
    setToken(response.token);
    setUser(response.user);
    setIsAuthenticated(true);
  };

  // 注册方法
  const register = async (username: string, email: string, password: string) => {
    const response = await authService.register(username, email, password);
    localStorage.setItem('token', response.token);
    setToken(response.token);
    setUser(response.user);
    setIsAuthenticated(true);
  };

  // 登出方法
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    token,
    login,
    register,
    logout
  };

  // 加载时显示等待
  if (loading) {
    return <div className="flex justify-center items-center h-screen">加载中...</div>;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

