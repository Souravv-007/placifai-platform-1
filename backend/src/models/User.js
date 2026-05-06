const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

async function hashPassword(user) {
  if (!user.password || user.password.startsWith('$2')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
}

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  targetRole: {
    type: DataTypes.STRING,
  },
  targetCompanies: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  experience: {
    type: DataTypes.STRING, // junior, mid, senior
  },
  resumeUrl: {
    type: DataTypes.STRING,
  },
  profileComplete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  hooks: {
    beforeCreate: hashPassword,
    beforeUpdate: hashPassword,
  },
});

User.prototype.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;
