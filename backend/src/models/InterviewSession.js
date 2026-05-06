const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InterviewSession = sequelize.define('InterviewSession', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING,
  },
  transcript: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  ratings: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  feedback: {
    type: DataTypes.TEXT,
  },
  startedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  completedAt: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'interview_sessions',
});

module.exports = InterviewSession;