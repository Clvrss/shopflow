'use strict';

const { DataTypes, Sequelize } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('audit_logs', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      actor_user_id: { type: DataTypes.INTEGER, allowNull: true },
      action: { type: DataTypes.STRING(80), allowNull: false },
      entity_type: { type: DataTypes.STRING(80), allowNull: false },
      entity_id: { type: DataTypes.INTEGER, allowNull: true },
      before: { type: DataTypes.JSON, allowNull: true },
      after: { type: DataTypes.JSON, allowNull: true },
      ip: { type: DataTypes.STRING(45) },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.addIndex('audit_logs', ['actor_user_id']);
    await queryInterface.addIndex('audit_logs', ['entity_type', 'entity_id']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('audit_logs');
  },
};
