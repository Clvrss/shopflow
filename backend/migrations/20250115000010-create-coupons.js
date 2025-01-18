'use strict';

const { DataTypes, Sequelize } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('coupons', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      description: { type: DataTypes.STRING(255) },
      discount_type: { type: DataTypes.ENUM('percent', 'fixed'), allowNull: false },
      discount_value: { type: DataTypes.INTEGER, allowNull: false },
      min_subtotal_cents: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      max_uses: { type: DataTypes.INTEGER, allowNull: true },
      uses_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      expires_at: { type: DataTypes.DATE, allowNull: true },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('coupon_redemptions', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      coupon_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      order_id: { type: DataTypes.INTEGER, allowNull: false },
      redeemed_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.addIndex('coupon_redemptions', ['coupon_id']);
    await queryInterface.addIndex('coupon_redemptions', ['user_id']);
    await queryInterface.addIndex('coupon_redemptions', ['order_id']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('coupon_redemptions');
    await queryInterface.dropTable('coupons');
  },
};
