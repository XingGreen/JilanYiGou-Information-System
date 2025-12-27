const db = require('../db');

// 获取思想的完整信息（包括标签）
const getFullIdea = (ideaId) => {
  const idea = db.idea.findById(ideaId);
  if (!idea) return null;
  
  // 获取与思想关联的标签ID
  const ideaTags = db.ideaTag.findByIdeaId(idea.id);
  const tagIds = ideaTags.map(ideaTag => ideaTag.tagId);
  
  // 获取标签信息
  const tags = tagIds.map(tagId => db.tag.findById(tagId)).filter(Boolean);
  
  return {
    ...idea,
    tags
  };
};

// 创建思想
exports.createIdea = async (req, res) => {
  try {
    const { title, content, category, status, importance, tags } = req.body;
    
    // 创建思想
    const newIdea = db.idea.create({
      title,
      content,
      category,
      status,
      importance,
      userId: req.user.id
    });
    
    // 处理标签
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        // 查找或创建标签
        let tag = db.tag.findByName(tagName);
        if (!tag) {
          tag = db.tag.create({ name: tagName.toLowerCase() });
        }
        
        // 建立思想和标签的关联
        db.ideaTag.create({
          ideaId: newIdea.id,
          tagId: tag.id
        });
      }
    }
    
    // 加载完整的思想信息（包括标签）
    const fullIdea = getFullIdea(newIdea.id);
    
    res.status(201).json({ message: '思想创建成功', idea: fullIdea });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 获取所有思想
exports.getAllIdeas = async (req, res) => {
  try {
    const { category, status, importance, tag, search } = req.query;
    const userId = req.user.id;
    
    // 获取用户的所有思想
    let ideas = db.idea.findAll(userId).map(idea => getFullIdea(idea.id));
    
    // 筛选条件
    if (category) {
      ideas = ideas.filter(idea => idea.category === category);
    }
    
    if (status) {
      ideas = ideas.filter(idea => idea.status === status);
    }
    
    if (importance) {
      ideas = ideas.filter(idea => idea.importance === parseInt(importance));
    }
    
    if (tag) {
      ideas = ideas.filter(idea => 
        idea.tags.some(t => t.name.toLowerCase() === tag.toLowerCase())
      );
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      ideas = ideas.filter(idea => 
        idea.title.toLowerCase().includes(searchLower) || 
        idea.content.toLowerCase().includes(searchLower)
      );
    }
    
    // 按更新时间降序排序
    ideas.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    
    res.json({ ideas });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 获取单个思想
exports.getIdeaById = async (req, res) => {
  try {
    const { id } = req.params;
    const ideaId = parseInt(id);
    
    const idea = getFullIdea(ideaId);
    
    if (!idea || idea.userId !== req.user.id) {
      return res.status(404).json({ message: '思想不存在' });
    }
    
    res.json({ idea });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 更新思想
exports.updateIdea = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, status, importance, tags } = req.body;
    const ideaId = parseInt(id);
    
    // 检查思想是否存在且属于当前用户
    const idea = db.idea.findById(ideaId);
    if (!idea || idea.userId !== req.user.id) {
      return res.status(404).json({ message: '思想不存在' });
    }
    
    // 更新思想信息
    db.idea.update(ideaId, {
      title,
      content,
      category,
      status,
      importance
    });
    
    // 更新标签
    if (tags !== undefined) {
      // 删除所有现有标签关联
      db.ideaTag.deleteByIdeaId(ideaId);
      
      // 添加新标签
      if (tags && tags.length > 0) {
        for (const tagName of tags) {
          let tag = db.tag.findByName(tagName);
          if (!tag) {
            tag = db.tag.create({ name: tagName.toLowerCase() });
          }
          
          db.ideaTag.create({
            ideaId: ideaId,
            tagId: tag.id
          });
        }
      }
    }
    
    // 加载更新后的完整思想信息
    const updatedIdea = getFullIdea(ideaId);
    
    res.json({ message: '思想更新成功', idea: updatedIdea });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 删除思想
exports.deleteIdea = async (req, res) => {
  try {
    const { id } = req.params;
    const ideaId = parseInt(id);
    
    // 检查思想是否存在且属于当前用户
    const idea = db.idea.findById(ideaId);
    if (!idea || idea.userId !== req.user.id) {
      return res.status(404).json({ message: '思想不存在' });
    }
    
    // 删除思想（会自动删除关联的标签）
    db.idea.delete(ideaId);
    
    res.json({ message: '思想删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 获取所有标签
exports.getAllTags = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 获取用户的所有思想
    const ideas = db.idea.findAll(userId);
    
    // 获取所有与用户思想关联的标签ID
    const ideaTagIds = ideas.flatMap(idea => {
      const ideaTags = db.ideaTag.findByIdeaId(idea.id);
      return ideaTags.map(ideaTag => ideaTag.tagId);
    });
    
    // 去重标签ID
    const uniqueTagIds = [...new Set(ideaTagIds)];
    
    // 获取标签信息
    const tags = uniqueTagIds.map(tagId => db.tag.findById(tagId)).filter(Boolean);
    
    res.json({ tags });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};