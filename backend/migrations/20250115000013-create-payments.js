'use strict';

const { DataTypes, Sequelize } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('payments', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      order_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
      amount_cents: { type: DataTypes.INTEGER, allowNull: false },
      method: { type: DataTypes.ENUM('card', 'paypal', 'bank_transfer', 'klarna'), allowNull: false, defaultValue: 'card' },
      gateway: { type: DataTypes.ENUM('simulated', 'stripe'), allowNull: false, defaultValue: 'simulated' },
      status: { type: DataTypes.ENUM('pending', 'succeeded', 'failed', 'refunded'), allowNull: false, defaultValue: 'pending' },
      transaction_id: { type: DataTypes.STRING(100), allowNull: true, unique: true },
      error_message: { type: DataTypes.TEXT },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('payments');
  },
};
