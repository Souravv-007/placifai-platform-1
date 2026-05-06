const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Resume = sequelize.define('Resume', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileUrl: {
    type: DataTypes.STRING,
  },
  rawText: {
    type: DataTypes.TEXT,
  },
  analysis: {
    type: DataTypes.JSONB,
    defaultValue: null,
  },
  score: {
    type: DataTypes.FLOAT,
  },
  feedback: {
    type: DataTypes.JSONB,
  },
  uploadedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'resumes',
});

module.exports = Resume;