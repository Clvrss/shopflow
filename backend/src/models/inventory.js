const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Inventory = sequelize.define(
  'Inventory',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    productId: { type: DataTypes.INTEGER, allowNull: false, field: 'product_id' },
    variantId: { type: DataTypes.INTEGER, allowNull: true, unique: true, field: 'variant_id' },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    reservedQuantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'reserved_quantity' },
    lowStockThreshold: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 5, field: 'low_stock_threshold' },
  },
  { tableName: 'inventory' }
);

Inventory.associate = function (models) {
  Inventory.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
  Inventory.belongsTo(models.ProductVariant, { foreignKey: 'variantId', as: 'variant' });
};

module.exports = Inventory;
