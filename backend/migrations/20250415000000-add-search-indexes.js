'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addIndex('products', ['name'], { name: 'idx_products_name' });
    await queryInterface.addIndex('orders', ['created_at'], { name: 'idx_orders_created_at' });
  },

  down: async (queryInterface) => {
    await queryInterface.removeIndex('products', 'idx_products_name');
    await queryInterface.removeIndex('orders', 'idx_orders_created_at');
  },
};
