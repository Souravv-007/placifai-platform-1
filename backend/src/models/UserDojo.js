const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserDojo = sequelize.define('UserDojo', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
  },
  xp: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lastSolvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  rank: {
    type: DataTypes.STRING,
    defaultValue: 'INITIATE',
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  }
});

module.exports = UserDojo;
