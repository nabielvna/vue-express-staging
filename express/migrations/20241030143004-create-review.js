'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('reviews', {
      id: {
        type: Sequelize.STRING(40),
        primaryKey: true
      },
      score: {
        type: Sequelize.DECIMAL(2, 1),
        allowNull: false,
      },
      comment: {
        type: Sequelize.STRING(500)
      },
      order_item_id: {
        type: Sequelize.STRING(40),
        references: {
          model: 'order_items',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      product_size_id: {
        type: Sequelize.STRING(40),
        references: {
          model: 'product_sizes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('reviews');
  }
};
