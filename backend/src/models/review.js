const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Review = sequelize.define(
  'Review',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    productId: { type: DataTypes.INTEGER, allowNull: false, field: 'product_id' },
    userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
    rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
    title: { type: DataTypes.STRING(120) },
    body: { type: DataTypes.TEXT },
    isVerifiedPurchase: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_verified_purchase' },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'approved',
    },
  },
  { tableName: 'reviews' }
);

Review.associate = function (models) {
  Review.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
  Review.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
};

module.exports = Review;
