'use strict';

const { DataTypes, Sequelize } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('inventory', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      product_id: { type: DataTypes.INTEGER, allowNull: false },
      variant_id: { type: DataTypes.INTEGER, allowNull: true, unique: true },
      quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      reserved_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      low_stock_threshold: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 5 },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.addIndex('inventory', ['product_id']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('inventory');
  },
};
