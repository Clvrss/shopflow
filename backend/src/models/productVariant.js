const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductVariant = sequelize.define(
  'ProductVariant',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    productId: { type: DataTypes.INTEGER, allowNull: false, field: 'product_id' },
    sku: { type: DataTypes.STRING(64), allowNull: false, unique: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    option1: { type: DataTypes.STRING(60) },
    option2: { type: DataTypes.STRING(60) },
    priceCents: { type: DataTypes.INTEGER, allowNull: true, field: 'price_cents' },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_active' },
  },
  { tableName: 'product_variants' }
);

ProductVariant.associate = function (models) {
  ProductVariant.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
  ProductVariant.hasOne(models.Inventory, { foreignKey: 'variantId', as: 'inventory' });
};

module.exports = ProductVariant;
