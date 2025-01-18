'use strict';

const { DataTypes, Sequelize } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('wishlist_items', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      product_id: { type: DataTypes.INTEGER, allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.addIndex('wishlist_items', ['user_id']);
    await queryInterface.addIndex('wishlist_items', ['product_id']);
    await queryInterface.addIndex('wishlist_items', ['user_id', 'product_id'], { unique: true, name: 'uq_wishlist_user_product' });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('wishlist_items');
  },
};
