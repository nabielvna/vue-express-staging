const { DataTypes, Op } = require('sequelize');

module.exports = (sequelize) => {
  const RefreshToken = sequelize.define('RefreshToken', {
    id: {
      type: DataTypes.STRING(40),
      primaryKey: true
    },
    user_id: {
      type: DataTypes.STRING(40),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    token: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    device_info: {
      type: DataTypes.STRING(200)
    },
    ip_address: {
      type: DataTypes.STRING(45)
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    last_used_at: {
      type: DataTypes.DATE
    },
    is_revoked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_remember_me: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'refresh_tokens'
  });

  // Tambahkan method statis untuk manajemen token
  RefreshToken.enforceTokenLimit = async function(userId, maxTokens = 5) {
    const activeTokenCount = await this.count({
      where: {
        user_id: userId,
        is_revoked: false,
        expires_at: {
          [Op.gt]: new Date()
        }
      }
    });

    if (activeTokenCount >= maxTokens) {
      // Ambil token-token yang akan dipertahankan berdasarkan last_used_at
      const tokensToKeep = await this.findAll({
        where: {
          user_id: userId,
          is_revoked: false,
          expires_at: {
            [Op.gt]: new Date()
          }
        },
        order: [['last_used_at', 'DESC']],
        limit: maxTokens - 1
      });

      const tokenIdsToKeep = tokensToKeep.map(token => token.id);

      // Revoke semua token aktif yang tidak masuk dalam daftar yang dipertahankan
      await this.update(
        { is_revoked: true },
        {
          where: {
            user_id: userId,
            is_revoked: false,
            id: {
              [Op.notIn]: tokenIdsToKeep
            }
          }
        }
      );
    }
  };

  // Method untuk cleanup token
  RefreshToken.cleanup = async function() {
    try {
      const result = await this.destroy({
        where: {
          [Op.or]: [
            // Hapus token yang sudah expired
            {
              expires_at: {
                [Op.lt]: new Date()
              }
            },
            // Hapus token yang sudah direvoke dan lebih dari 30 hari
            {
              is_revoked: true,
              updated_at: {
                [Op.lt]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              }
            }
          ]
        }
      });
      console.log(`Cleaned up ${result} expired/revoked tokens`);
      return result;
    } catch (error) {
      console.error('Token cleanup error:', error);
      throw error;
    }
  };

  // Method untuk merevoke semua token user
  RefreshToken.revokeAllUserTokens = async function(userId) {
    try {
      const result = await this.update(
        { is_revoked: true },
        {
          where: {
            user_id: userId,
            is_revoked: false
          }
        }
      );
      return result;
    } catch (error) {
      console.error('Error revoking user tokens:', error);
      throw error;
    }
  };

  // Method untuk mengecek apakah token masih valid
  RefreshToken.isTokenValid = async function(userId, token) {
    const storedToken = await this.findOne({
      where: {
        user_id: userId,
        is_revoked: false,
        expires_at: {
          [Op.gt]: new Date()
        }
      },
      order: [['created_at', 'DESC']]
    });

    return storedToken !== null;
  };

  RefreshToken.associate = (models) => {
    RefreshToken.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return RefreshToken;
};