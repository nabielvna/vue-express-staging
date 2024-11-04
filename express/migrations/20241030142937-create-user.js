'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.STRING(40),
        primaryKey: true
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      nickname: {
        type: Sequelize.STRING(50)
      },
      name: {
        type: Sequelize.STRING(100)
      },
      password: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      profile_picture: {
        type: Sequelize.STRING(300)
      },
      phone_number: {
        type: Sequelize.STRING(20)
      },
      accept_policy: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      role_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'roles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    await queryInterface.dropTable('users');
  }
};