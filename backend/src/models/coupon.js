const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Coupon = sequelize.define(
  'Coupon',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    description: { type: DataTypes.STRING(255) },
    discountType: {
      type: DataTypes.ENUM('percent', 'fixed'),
      allowNull: false,
      field: 'discount_type',
    },
    // For percent coupons this is the percentage (e.g. 10). For fixed coupons it is cents.
    discountValue: { type: DataTypes.INTEGER, allowNull: false, field: 'discount_value' },
    minSubtotalCents: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'min_subtotal_cents' },
    maxUses: { type: DataTypes.INTEGER, allowNull: true, field: 'max_uses' },
    usesCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'uses_count' },
    expiresAt: { type: DataTypes.DATE, allowNull: true, field: 'expires_at' },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_active' },
  },
  { tableName: 'coupons' }
);

Coupon.associate = function (models) {
  Coupon.hasMany(models.Order, { foreignKey: 'couponId', as: 'orders' });
  Coupon.hasMany(models.CouponRedemption, { foreignKey: 'couponId', as: 'redemptions' });
};

module.exports = Coupon;
