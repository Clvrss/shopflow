const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Profile = sequelize.define(
  'Profile',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, unique: true, field: 'user_id' },
    bio: { type: DataTypes.TEXT },
    avatarUrl: { type: DataTypes.STRING(500), field: 'avatar_url' },
    locale: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'en' },
    marketingOptIn: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'marketing_opt_in' },
    lastLoginAt: { type: DataTypes.DATE, field: 'last_login_at' },
  },
  { tableName: 'profiles' }
);

Profile.associate = function (models) {
  Profile.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
};

module.exports = Profile;
