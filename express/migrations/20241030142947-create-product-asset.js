'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('product_assets', {
      id: {
        type: Sequelize.STRING(40),
        primaryKey: true
      },
      asset: {
        type: Sequelize.STRING(300),
        allowNull: false
      },
      product_id: {
        type: Sequelize.STRING(40),
        references: {
          model: 'products',
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
    await queryInterface.dropTable('product_assets');
  }
};