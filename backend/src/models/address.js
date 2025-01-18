const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Address = sequelize.define(
  'Address',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
    label: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'Home' },
    firstName: { type: DataTypes.STRING(100), allowNull: false, field: 'first_name' },
    lastName: { type: DataTypes.STRING(100), allowNull: false, field: 'last_name' },
    line1: { type: DataTypes.STRING(255), allowNull: false },
    line2: { type: DataTypes.STRING(255) },
    city: { type: DataTypes.STRING(100), allowNull: false },
    state: { type: DataTypes.STRING(100) },
    postalCode: { type: DataTypes.STRING(20), field: 'postal_code' },
    country: { type: DataTypes.STRING(2), allowNull: false, defaultValue: 'US' },
    isDefault: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_default' },
  },
  { tableName: 'addresses' }
);

Address.associate = function (models) {
  Address.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  Address.hasMany(models.Order, { foreignKey: 'addressId', as: 'orders' });
};

module.exports = Address;
