const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define(
  'Category',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    slug: { type: DataTypes.STRING(120), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT },
    parentId: { type: DataTypes.INTEGER, allowNull: true, field: 'parent_id' },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_active' },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'sort_order' },
  },
  { tableName: 'categories' }
);

Category.associate = function (models) {
  Category.belongsTo(models.Category, { foreignKey: 'parentId', as: 'parent' });
  Category.hasMany(models.Category, { foreignKey: 'parentId', as: 'children' });
  Category.hasMany(models.Product, { foreignKey: 'categoryId', as: 'products' });
};

module.exports = Category;
