const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Submission = sequelize.define('Submission', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  challengeId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  language: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  code: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Accepted', 'Wrong Answer', 'Compilation Error', 'Runtime Error', 'Time Limit Exceeded', 'Processing'),
    defaultValue: 'Processing',
  },
  runtimeMs: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  memoryKb: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  error: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
});

module.exports = Submission;
