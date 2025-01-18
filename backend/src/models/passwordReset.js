const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PasswordReset = sequelize.define(
  'PasswordReset',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
    tokenHash: { type: DataTypes.STRING(64), allowNull: false, field: 'token_hash' },
    expiresAt: { type: DataTypes.DATE, allowNull: false, field: 'expires_at' },
    usedAt: { type: DataTypes.DATE, allowNull: true, field: 'used_at' },
  },
  { tableName: 'password_resets' }
);

PasswordReset.associate = function (models) {
  PasswordReset.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
};

module.exports = PasswordReset;
