const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Idea = sequelize.define('Idea', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'completed'),
    defaultValue: 'draft'
  },
  importance: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  }
}, {
  timestamps: true
});

// 建立关系
Idea.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Idea);

module.exports = Idea;