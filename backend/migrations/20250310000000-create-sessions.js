'use strict';

const { DataTypes, Sequelize } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('sessions', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      refresh_token_hash: { type: DataTypes.STRING(255), allowNull: false },
      user_agent: { type: DataTypes.STRING(255) },
      ip: { type: DataTypes.STRING(45) },
      expires_at: { type: DataTypes.DATE, allowNull: false },
      revoked_at: { type: DataTypes.DATE, allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.addIndex('sessions', ['user_id']);
    await queryInterface.addIndex('sessions', ['refresh_token_hash']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('sessions');
  },
};
