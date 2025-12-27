const express = require('express');
const router = express.Router();
const {
  createIdea,
  getAllIdeas,
  getIdeaById,
  updateIdea,
  deleteIdea,
  getAllTags
} = require('../controllers/ideaController');
const auth = require('../middleware/auth');

// 创建思想
router.post('/', auth, createIdea);

// 获取所有思想
router.get('/', auth, getAllIdeas);

// 获取单个思想
router.get('/:id', auth, getIdeaById);

// 更新思想
router.put('/:id', auth, updateIdea);

// 删除思想
router.delete('/:id', auth, deleteIdea);

// 获取所有标签
router.get('/tags/all', auth, getAllTags);

module.exports = router;