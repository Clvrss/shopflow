'use strict';

const { DataTypes, Sequelize } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('products', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      sku: { type: DataTypes.STRING(64), allowNull: false, unique: true },
      name: { type: DataTypes.STRING(255), allowNull: false },
      slug: { type: DataTypes.STRING(280), allowNull: false, unique: true },
      description: { type: DataTypes.TEXT },
      price_cents: { type: DataTypes.INTEGER, allowNull: false },
      category_id: { type: DataTypes.INTEGER, allowNull: true },
      brand: { type: DataTypes.STRING(100) },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      featured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      deleted_at: { type: DataTypes.DATE, allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.addIndex('products', ['category_id']);
    await queryInterface.addIndex('products', ['is_active']);
    await queryInterface.addIndex('products', ['featured']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('products');
  },
};
