const fs = require('fs');
const path = require('path');

// 数据文件路径
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'database.json');

// 初始化数据库
const initDatabase = () => {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initialData = {
        users: [],
        ideas: [],
        tags: [],
        ideaTags: []
      };
      fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
    }
  } catch (error) {
    console.error('初始化数据库失败:', error);
    throw error;
  }
};

// 读取数据库数据
const readDatabase = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('读取数据库失败:', error);
    throw error;
  }
};

// 写入数据库数据
const writeDatabase = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('写入数据库失败:', error);
    throw error;
  }
};

// 获取下一个ID
const getNextId = (collection) => {
  const db = readDatabase();
  if (db[collection].length === 0) {
    return 1;
  }
  const maxId = Math.max(...db[collection].map(item => item.id));
  return maxId + 1;
};

// 模型操作方法
const db = {
  // 用户操作
  user: {
    create: (userData) => {
      const db = readDatabase();
      const newUser = {
        ...userData,
        id: getNextId('users'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      db.users.push(newUser);
      writeDatabase(db);
      return newUser;
    },
    findByEmail: (email) => {
      const db = readDatabase();
      return db.users.find(user => user.email === email);
    },
    findByUsername: (username) => {
      const db = readDatabase();
      return db.users.find(user => user.username === username);
    },
    findById: (id) => {
      const db = readDatabase();
      return db.users.find(user => user.id === id);
    }
  },

  // 想法操作
  idea: {
    create: (ideaData) => {
      const db = readDatabase();
      const newIdea = {
        ...ideaData,
        id: getNextId('ideas'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      db.ideas.push(newIdea);
      writeDatabase(db);
      return newIdea;
    },
    findAll: (userId) => {
      const db = readDatabase();
      return db.ideas.filter(idea => idea.userId === userId);
    },
    findById: (id) => {
      const db = readDatabase();
      return db.ideas.find(idea => idea.id === id);
    },
    update: (id, ideaData) => {
      const db = readDatabase();
      const index = db.ideas.findIndex(idea => idea.id === id);
      if (index === -1) return null;
      
      db.ideas[index] = {
        ...db.ideas[index],
        ...ideaData,
        updatedAt: new Date().toISOString()
      };
      writeDatabase(db);
      return db.ideas[index];
    },
    delete: (id) => {
      const db = readDatabase();
      const index = db.ideas.findIndex(idea => idea.id === id);
      if (index === -1) return false;
      
      db.ideas.splice(index, 1);
      
      // 删除相关的标签关联
      db.ideaTags = db.ideaTags.filter(ideaTag => ideaTag.ideaId !== id);
      
      writeDatabase(db);
      return true;
    }
  },

  // 标签操作
  tag: {
    create: (tagData) => {
      const db = readDatabase();
      const newTag = {
        ...tagData,
        id: getNextId('tags'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      db.tags.push(newTag);
      writeDatabase(db);
      return newTag;
    },
    findByName: (name) => {
      const db = readDatabase();
      return db.tags.find(tag => tag.name.toLowerCase() === name.toLowerCase());
    },
    findById: (id) => {
      const db = readDatabase();
      return db.tags.find(tag => tag.id === id);
    },
    findAll: () => {
      const db = readDatabase();
      return db.tags;
    }
  },

  // 想法标签关联操作
  ideaTag: {
    create: (ideaTagData) => {
      const db = readDatabase();
      const newIdeaTag = {
        ...ideaTagData,
        id: getNextId('ideaTags'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      db.ideaTags.push(newIdeaTag);
      writeDatabase(db);
      return newIdeaTag;
    },
    findByIdeaId: (ideaId) => {
      const db = readDatabase();
      return db.ideaTags.filter(ideaTag => ideaTag.ideaId === ideaId);
    },
    deleteByIdeaId: (ideaId) => {
      const db = readDatabase();
      db.ideaTags = db.ideaTags.filter(ideaTag => ideaTag.ideaId !== ideaId);
      writeDatabase(db);
      return true;
    },
    findByTagId: (tagId) => {
      const db = readDatabase();
      return db.ideaTags.filter(ideaTag => ideaTag.tagId === tagId);
    }
  }
};

// 将initDatabase函数添加到db对象中
db.init = initDatabase;

// 初始化数据库
db.init();

module.exports = db;