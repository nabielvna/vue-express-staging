const { RefreshToken } = require('../models');
const { Op } = require('sequelize');

const cleanupExpiredTokens = async () => {
  try {
    const result = await RefreshToken.destroy({
      where: {
        [Op.or]: [
          {
            expires_at: {
              [Op.lt]: new Date()
            }
          },
          {
            is_revoked: true,
            updated_at: {
              [Op.lt]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 hari
            }
          }
        ]
      }
    });
    console.log(`Cleaned up ${result} expired/revoked tokens`);
  } catch (error) {
    console.error('Token cleanup job error:', error);
  }
};

module.exports = cleanupExpiredTokens;