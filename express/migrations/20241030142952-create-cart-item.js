'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('cart_items', {
      id: {
        type: Sequelize.STRING(40),
        primaryKey: true
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        allowNull: false,
        validate: {
          min: 1
        }
      },
      cart_id: {
        type: Sequelize.STRING(40),
        allowNull: false,
        references: {
          model: 'carts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      product_size_id: {
        type: Sequelize.STRING(40),
        allowNull: false,
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

    // Add unique constraint to prevent duplicate items in cart
    await queryInterface.addConstraint('cart_items', {
      fields: ['cart_id', 'product_size_id'],
      type: 'unique',
      name: 'unique_cart_item'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('cart_items');
  }
};