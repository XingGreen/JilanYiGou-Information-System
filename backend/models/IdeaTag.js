const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Idea = require('./Idea');
const Tag = require('./Tag');

const IdeaTag = sequelize.define('IdeaTag', {
  ideaId: {
    type: DataTypes.INTEGER,
    references: {
      model: Idea,
      key: 'id'
    },
    allowNull: false
  },
  tagId: {
    type: DataTypes.INTEGER,
    references: {
      model: Tag,
      key: 'id'
    },
    allowNull: false
  }
}, {
  timestamps: true
});

// 建立多对多关系
Idea.belongsToMany(Tag, { through: IdeaTag });
Tag.belongsToMany(Idea, { through: IdeaTag });

module.exports = IdeaTag;