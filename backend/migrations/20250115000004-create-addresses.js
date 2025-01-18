'use strict';

const { DataTypes, Sequelize } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('addresses', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      label: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'Home' },
      first_name: { type: DataTypes.STRING(100), allowNull: false },
      last_name: { type: DataTypes.STRING(100), allowNull: false },
      line1: { type: DataTypes.STRING(255), allowNull: false },
      line2: { type: DataTypes.STRING(255) },
      city: { type: DataTypes.STRING(100), allowNull: false },
      state: { type: DataTypes.STRING(100) },
      postal_code: { type: DataTypes.STRING(20) },
      country: { type: DataTypes.STRING(2), allowNull: false, defaultValue: 'US' },
      is_default: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.addIndex('addresses', ['user_id']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('addresses');
  },
};
