const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define(
  'Order',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    orderNumber: { type: DataTypes.STRING(32), allowNull: false, unique: true, field: 'order_number' },
    userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
    addressId: { type: DataTypes.INTEGER, allowNull: false, field: 'address_id' },
    subtotalCents: { type: DataTypes.INTEGER, allowNull: false, field: 'subtotal_cents' },
    shippingCents: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'shipping_cents' },
    taxCents: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'tax_cents' },
    discountCents: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'discount_cents' },
    totalCents: { type: DataTypes.INTEGER, allowNull: false, field: 'total_cents' },
    currency: { type: DataTypes.STRING(3), allowNull: false, defaultValue: 'USD' },
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded'),
      allowNull: false,
      defaultValue: 'pending',
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
      allowNull: false,
      defaultValue: 'pending',
      field: 'payment_status',
    },
    couponId: { type: DataTypes.INTEGER, allowNull: true, field: 'coupon_id' },
  },
  { tableName: 'orders' }
);

Order.associate = function (models) {
  Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  Order.belongsTo(models.Address, { foreignKey: 'addressId', as: 'address' });
  Order.belongsTo(models.Coupon, { foreignKey: 'couponId', as: 'coupon' });
  Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items' });
  Order.hasOne(models.Payment, { foreignKey: 'orderId', as: 'payment' });
};

module.exports = Order;
