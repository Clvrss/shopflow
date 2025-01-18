'use strict';

const { DataTypes, Sequelize } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('users', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      password_hash: { type: DataTypes.STRING(255), allowNull: false },
      first_name: { type: DataTypes.STRING(100), allowNull: false },
      last_name: { type: DataTypes.STRING(100), allowNull: false },
      phone: { type: DataTypes.STRING(30) },
      role_id: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 3 },
      status: { type: DataTypes.ENUM('pending', 'active', 'disabled'), allowNull: false, defaultValue: 'active' },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.addIndex('users', ['email']);
    await queryInterface.addIndex('users', ['role_id']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('users');
  },
};
