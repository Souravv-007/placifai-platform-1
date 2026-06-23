const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DojoChallenge = sequelize.define('DojoChallenge', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  difficulty: {
    type: DataTypes.ENUM('Easy', 'Medium', 'Hard'),
    defaultValue: 'Medium',
  },
  topics: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: 'Algorithms',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  explanation: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  rewardXP: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
  },
  constraints: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  starterCode: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  isDaily: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  activeDate: {
    type: DataTypes.DATEONLY, // Used to rotate daily challenges
    allowNull: true,
  }
});

module.exports = DojoChallenge;
