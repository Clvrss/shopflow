'use strict';

const { DataTypes, Sequelize } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('profiles', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
      bio: { type: DataTypes.TEXT },
      avatar_url: { type: DataTypes.STRING(500) },
      locale: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'en' },
      marketing_opt_in: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      last_login_at: { type: DataTypes.DATE },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('profiles');
  },
};
