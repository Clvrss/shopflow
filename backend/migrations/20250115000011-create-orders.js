'use strict';

const { DataTypes, Sequelize } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('orders', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      order_number: { type: DataTypes.STRING(32), allowNull: false, unique: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      address_id: { type: DataTypes.INTEGER, allowNull: false },
      subtotal_cents: { type: DataTypes.INTEGER, allowNull: false },
      shipping_cents: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      tax_cents: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      discount_cents: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      total_cents: { type: DataTypes.INTEGER, allowNull: false },
      currency: { type: DataTypes.STRING(3), allowNull: false, defaultValue: 'USD' },
      status: { type: DataTypes.ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded'), allowNull: false, defaultValue: 'pending' },
      payment_status: { type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'), allowNull: false, defaultValue: 'pending' },
      coupon_id: { type: DataTypes.INTEGER, allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.addIndex('orders', ['user_id']);
    await queryInterface.addIndex('orders', ['status']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('orders');
  },
};
