'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.STRING(40),
        primaryKey: true
      },
      total_price: {
        type: Sequelize.DECIMAL(20, 2),
        defaultValue: 0
      },
      total_item: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      user_id: {
        type: Sequelize.STRING(40),
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      address_id: {
        type: Sequelize.STRING(40),
        allowNull: false,
        references: {
          model: 'addresses',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      order_status_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'order_statuses',
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
    await queryInterface.dropTable('orders');
  }
};