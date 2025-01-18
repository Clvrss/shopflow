const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cart = sequelize.define(
  'Cart',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, unique: true, field: 'user_id' },
    status: {
      type: DataTypes.ENUM('active', 'checked_out'),
      allowNull: false,
      defaultValue: 'active',
    },
  },
  { tableName: 'carts' }
);

Cart.associate = function (models) {
  Cart.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  Cart.hasMany(models.CartItem, { foreignKey: 'cartId', as: 'items' });
};

module.exports = Cart;
