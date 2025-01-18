const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define(
  'Notification',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
    type: { type: DataTypes.STRING(50), allowNull: false },
    title: { type: DataTypes.STRING(255), allowNull: false },
    body: { type: DataTypes.TEXT },
    link: { type: DataTypes.STRING(500) },
    isRead: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_read' },
    readAt: { type: DataTypes.DATE, allowNull: true, field: 'read_at' },
  },
  { tableName: 'notifications' }
);

Notification.associate = function (models) {
  Notification.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
};

module.exports = Notification;
