const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TestCase = sequelize.define('TestCase', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  challengeId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  input: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  expectedOutput: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  isHidden: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
});

module.exports = TestCase;
