import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Idea } from '../types';
import { ideaService } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const IdeaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (id && isAuthenticated) {
      const fetchIdea = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await ideaService.getIdeaById(Number(id));
          setIdea(data);
        } catch (err) {
          setError('加载思想失败');
          console.error('Fetch idea error:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchIdea();
    }
  }, [id, isAuthenticated]);

  const handleDelete = async () => {
    if (window.confirm('确定要删除这个思想吗？')) {
      try {
        await ideaService.deleteIdea(Number(id));
        navigate('/ideas');
      } catch (err) {
        setError('删除思想失败');
        console.error('Delete idea error:', err);
      }
    }
  };

  const statusLabels = {
    draft: { text: '草稿', className: 'bg-gray-200 text-gray-800' },
    active: { text: '进行中', className: 'bg-blue-200 text-blue-800' },
    completed: { text: '已完成', className: 'bg-green-200 text-green-800' }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">加载中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        思想不存在
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{idea.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>创建于 {new Date(idea.createdAt).toLocaleDateString('zh-CN')}</span>
            <span>更新于 {new Date(idea.updatedAt).toLocaleDateString('zh-CN')}</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusLabels[idea.status].className}`}>
          {statusLabels[idea.status].text}
        </span>
      </div>

      {idea.category && (
        <div className="mb-4">
          <span className="text-sm text-gray-500">分类：</span>
          <span className="text-sm text-gray-700 font-medium">{idea.category}</span>
        </div>
      )}

      {idea.importance && (
        <div className="mb-4">
          <span className="text-sm text-gray-500">重要性：</span>
          <div className="inline-flex items-center text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`text-lg ${i < idea.importance ? 'fill-current' : ''}`}>
                ★
              </span>
            ))}
          </div>
        </div>
      )}

      {idea.Tags && idea.Tags.length > 0 && (
        <div className="mb-6">
          <span className="text-sm text-gray-500">标签：</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {idea.Tags.map((tag) => (
              <span key={tag.id} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">内容</h2>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{idea.content}</p>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Link
          to="/ideas"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out"
        >
          返回列表
        </Link>
        <Link
          to={`/ideas/${idea.id}/edit`}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out"
        >
          编辑
        </Link>
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out"
        >
          删除
        </button>
      </div>
    </div>
  );
};

export default IdeaDetailPage;
