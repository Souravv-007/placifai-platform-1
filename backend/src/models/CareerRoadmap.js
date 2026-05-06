const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CareerRoadmap = sequelize.define('CareerRoadmap', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  targetRole: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  currentLevel: {
    type: DataTypes.STRING,
  },
  roadmap: {
    type: DataTypes.JSONB,
    defaultValue: null,
  },
  milestones: {
    type: DataTypes.JSONB,
    defaultValue: null,
  },
  skillGaps: {
    type: DataTypes.JSONB,
  },
  generatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'career_roadmaps',
});

module.exports = CareerRoadmap;