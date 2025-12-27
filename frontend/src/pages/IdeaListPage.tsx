import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { Idea, IdeaFilters } from '../types';
import { ideaService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';

const IdeaListPage: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<IdeaFilters>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const { isAuthenticated } = useAuth();

  // 获取思想列表
  const fetchIdeas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 构建筛选参数
      const params: IdeaFilters = {};
      if (filters.category) params.category = filters.category;
      if (filters.status) params.status = filters.status;
      if (filters.importance) params.importance = filters.importance;
      if (filters.tag) params.tag = filters.tag;
      if (searchQuery) params.search = searchQuery;
      
      const data = await ideaService.getAllIdeas(params);
      setIdeas(data);
    } catch (err) {
      setError('获取思想列表失败');
      console.error('Fetch ideas error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, searchQuery]);

  // 初始化时获取思想列表
  useEffect(() => {
    if (isAuthenticated) {
      fetchIdeas();
    }
  }, [isAuthenticated, fetchIdeas]);

  // 删除思想
  const handleDelete = async (id: number) => {
    if (window.confirm('确定要删除这个思想吗？')) {
      try {
        await ideaService.deleteIdea(id);
        // 重新获取思想列表
        fetchIdeas();
      } catch (err) {
        setError('删除思想失败');
        console.error('Delete idea error:', err);
      }
    }
  };

  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 搜索查询已经通过useState更新，会触发useEffect重新获取数据
  };

  // 状态标签样式映射
  const statusLabels = {
    draft: { text: '草稿', className: 'bg-gray-200 text-gray-800' },
    active: { text: '进行中', className: 'bg-blue-200 text-blue-800' },
    completed: { text: '已完成', className: 'bg-green-200 text-green-800' }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">我的思想</h2>
          <Link
            to="/ideas/new"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out"
          >
            创建新思想
          </Link>
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <input
                type="text"
                placeholder="搜索思想..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <select
                value={filters.status || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value || undefined }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">所有状态</option>
                <option value="draft">草稿</option>
                <option value="active">进行中</option>
                <option value="completed">已完成</option>
              </select>
            </div>
            <div>
              <select
                value={filters.importance || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, importance: e.target.value ? Number(e.target.value) : undefined }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">所有重要性</option>
                <option value="1">1 - 低</option>
                <option value="2">2</option>
                <option value="3">3 - 中</option>
                <option value="4">4</option>
                <option value="5">5 - 高</option>
              </select>
            </div>
          </form>
        </div>

        {/* 思想列表 */}
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <p className="text-gray-600">加载中...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : ideas.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">还没有创建任何思想</p>
            <Link
              to="/ideas/new"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out"
            >
              创建第一个思想
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <div key={idea.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{idea.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusLabels[idea.status].className}`}>
                    {statusLabels[idea.status].text}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">{idea.content}</p>
                
                {/* 标签 */}
                {idea.Tags && idea.Tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {idea.Tags.map((tag) => (
                      <span key={tag.id} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {idea.importance && (
                      <div className="flex text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={`text-sm ${i < (idea.importance ?? 0) ? 'fill-current' : ''}`}>
                            ★
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link
                      to={`/ideas/${idea.id}`}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md text-sm font-medium transition duration-300 ease-in-out"
                    >
                      查看
                    </Link>
                    <Link
                      to={`/ideas/${idea.id}/edit`}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium transition duration-300 ease-in-out"
                    >
                      编辑
                    </Link>
                    <button
                      onClick={() => handleDelete(idea.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium transition duration-300 ease-in-out"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeaListPage;