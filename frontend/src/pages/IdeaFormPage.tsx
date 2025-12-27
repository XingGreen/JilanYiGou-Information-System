import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { ideaService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';

interface IdeaFormData {
  title: string;
  content: string;
  category?: string;
  status: 'draft' | 'active' | 'completed';
  importance?: number;
  tags?: string[];
}

const IdeaFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(id ? true : false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState<string>('');
  const { isAuthenticated } = useAuth();
  
  const { register, handleSubmit, setValue, watch } = useForm<IdeaFormData>({
    defaultValues: {
      title: '',
      content: '',
      category: '',
      status: 'draft',
      importance: 3,
      tags: []
    }
  });
  
  const tags = watch('tags') || [];

  // 如果是编辑模式，加载现有思想数据
  useEffect(() => {
    if (id && isAuthenticated) {
      const fetchIdea = async () => {
        try {
          const data = await ideaService.getIdeaById(Number(id));
          setValue('title', data.title);
          setValue('content', data.content);
          setValue('category', data.category || '');
          setValue('status', data.status);
          setValue('importance', data.importance || 3);
          if (data.Tags) {
            setValue('tags', data.Tags.map(tag => tag.name));
          }
        } catch (err) {
          setError('加载思想失败');
          console.error('Fetch idea error:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchIdea();
    }
  }, [id, isAuthenticated, setValue]);

  // 添加标签
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        setValue('tags', [...tags, newTag]);
      }
      setTagInput('');
    }
  };

  // 移除标签
  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', tags.filter(tag => tag !== tagToRemove));
  };

  // 提交表单
  const onSubmit = async (data: IdeaFormData) => {
    try {
      setSaving(true);
      setError(null);
      
      const ideaData = {
        ...data,
        tags: data.tags?.filter(tag => tag.trim())
      };
      
      if (id) {
        // 更新现有思想
        await ideaService.updateIdea(Number(id), ideaData);
      } else {
        // 创建新思想
        await ideaService.createIdea(ideaData);
      }
      
      // 导航回思想列表或思想详情页
      navigate(id ? `/ideas/${id}` : '/ideas');
    } catch (err) {
      setError(id ? '更新思想失败' : '创建思想失败');
      console.error(id ? 'Update idea error:' : 'Create idea error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {id ? '编辑思想' : '创建新思想'}
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
              标题 *
            </label>
            <input
              id="title"
              type="text"
              {...register('title', { required: '标题不能为空' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入思想标题"
              disabled={saving}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
              内容 *
            </label>
            <textarea
              id="content"
              rows={8}
              {...register('content', { required: '内容不能为空' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入思想内容"
              disabled={saving}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
                分类
              </label>
              <input
                id="category"
                type="text"
                {...register('category')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入分类（可选）"
                disabled={saving}
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">
                状态
              </label>
              <select
                id="status"
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={saving}
              >
                <option value="draft">草稿</option>
                <option value="active">进行中</option>
                <option value="completed">已完成</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="importance" className="block text-gray-700 text-sm font-bold mb-2">
              重要性（1-5）
            </label>
            <input
              id="importance"
              type="range"
              min="1"
              max="5"
              {...register('importance', { valueAsNumber: true })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              disabled={saving}
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>低</span>
              <span>中</span>
              <span>高</span>
            </div>
            <div className="flex justify-center mt-2 text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`text-xl ${i < (watch('importance') || 3) ? 'fill-current' : ''}`}>
                  ★
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              标签
            </label>
            <div className="flex items-center space-x-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="输入标签并按Enter添加"
                disabled={saving}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-blue-900 hover:text-blue-500"
                    disabled={saving}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/ideas')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out"
              disabled={saving}
            >
              取消
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={saving}
            >
              {saving ? '保存中...' : (id ? '更新' : '创建')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IdeaFormPage;