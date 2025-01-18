const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CouponRedemption = sequelize.define(
  'CouponRedemption',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    couponId: { type: DataTypes.INTEGER, allowNull: false, field: 'coupon_id' },
    userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
    orderId: { type: DataTypes.INTEGER, allowNull: false, field: 'order_id' },
    redeemedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'redeemed_at' },
  },
  { tableName: 'coupon_redemptions' }
);

CouponRedemption.associate = function (models) {
  CouponRedemption.belongsTo(models.Coupon, { foreignKey: 'couponId', as: 'coupon' });
  CouponRedemption.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  CouponRedemption.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
};

module.exports = CouponRedemption;
