const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define(
  'Payment',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    orderId: { type: DataTypes.INTEGER, allowNull: false, unique: true, field: 'order_id' },
    amountCents: { type: DataTypes.INTEGER, allowNull: false, field: 'amount_cents' },
    method: {
      type: DataTypes.ENUM('card', 'paypal', 'bank_transfer', 'klarna'),
      allowNull: false,
      defaultValue: 'card',
    },
    gateway: { type: DataTypes.ENUM('simulated', 'stripe'), allowNull: false, defaultValue: 'simulated' },
    status: {
      type: DataTypes.ENUM('pending', 'succeeded', 'failed', 'refunded'),
      allowNull: false,
      defaultValue: 'pending',
    },
    transactionId: { type: DataTypes.STRING(100), unique: true, field: 'transaction_id' },
    errorMessage: { type: DataTypes.TEXT, field: 'error_message' },
  },
  { tableName: 'payments' }
);

Payment.associate = function (models) {
  Payment.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
};

module.exports = Payment;
