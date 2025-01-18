const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AuditLog = sequelize.define(
  'AuditLog',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    actorUserId: { type: DataTypes.INTEGER, allowNull: true, field: 'actor_user_id' },
    action: { type: DataTypes.STRING(80), allowNull: false },
    entityType: { type: DataTypes.STRING(80), allowNull: false, field: 'entity_type' },
    entityId: { type: DataTypes.INTEGER, allowNull: true, field: 'entity_id' },
    before: { type: DataTypes.JSON, allowNull: true },
    after: { type: DataTypes.JSON, allowNull: true },
    ip: { type: DataTypes.STRING(45) },
  },
  { tableName: 'audit_logs' }
);

AuditLog.associate = function (models) {
  AuditLog.belongsTo(models.User, { foreignKey: 'actorUserId', as: 'actor' });
};

module.exports = AuditLog;
