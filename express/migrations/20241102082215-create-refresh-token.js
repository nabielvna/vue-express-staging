'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('refresh_tokens', {
      id: {
        type: Sequelize.STRING(40),
        primaryKey: true
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
      token: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      device_info: {
        type: Sequelize.STRING(200)
      },
      ip_address: {
        type: Sequelize.STRING(45)
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      last_used_at: {
        type: Sequelize.DATE
      },
      is_revoked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_remember_me: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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

    // Basic indexes (existing)
    await queryInterface.addIndex('refresh_tokens', ['user_id']);
    await queryInterface.addIndex('refresh_tokens', ['token']);

    // Composite index untuk optimasi query active tokens per user
    await queryInterface.addIndex('refresh_tokens', 
      ['user_id', 'is_revoked', 'expires_at'],
      {
        name: 'idx_refresh_tokens_user_active'
      }
    );

    // Index untuk optimasi cleanup job
    await queryInterface.addIndex('refresh_tokens', 
      ['expires_at'],
      {
        name: 'idx_refresh_tokens_expires_at'
      }
    );

    // Index untuk last_used_at queries
    await queryInterface.addIndex('refresh_tokens', 
      ['last_used_at'],
      {
        name: 'idx_refresh_tokens_last_used'
      }
    );

    // Index untuk updated_at (untuk cleanup tokens yang sudah revoked)
    await queryInterface.addIndex('refresh_tokens', 
      ['updated_at'],
      {
        name: 'idx_refresh_tokens_updated_at'
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Drop semua index sebelum drop table
    await queryInterface.removeIndex('refresh_tokens', 'idx_refresh_tokens_user_active');
    await queryInterface.removeIndex('refresh_tokens', 'idx_refresh_tokens_expires_at');
    await queryInterface.removeIndex('refresh_tokens', 'idx_refresh_tokens_last_used');
    await queryInterface.removeIndex('refresh_tokens', 'idx_refresh_tokens_updated_at');
    
    // Drop existing indexes
    await queryInterface.removeIndex('refresh_tokens', ['user_id']);
    await queryInterface.removeIndex('refresh_tokens', ['token']);

    // Drop table
    await queryInterface.dropTable('refresh_tokens');
  }
};