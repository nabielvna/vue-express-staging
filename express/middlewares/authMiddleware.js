const jwt = require('jsonwebtoken');
const { User, Role, RefreshToken } = require('../models');
const { Op } = require('sequelize');

const authMiddleware = {
    async verifyToken(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    status: 'error',
                    message: 'No token provided'
                });
            }

            const token = authHeader.split(' ')[1];
            
            // Verify token and get decoded data
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

            // Check if there's any valid refresh token
            const validRefreshToken = await RefreshToken.findOne({
                where: {
                    user_id: decoded.id,
                    is_revoked: false,
                    expires_at: {
                        [Op.gt]: new Date()
                    }
                },
                order: [['created_at', 'DESC']]
            });

            if (!validRefreshToken) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Token has been revoked',
                    code: 'TOKEN_REVOKED'
                });
            }

            // Find user with role
            const user = await User.findByPk(decoded.id, {
                include: [{
                    model: Role,
                    required: true,
                    attributes: ['id', 'name']
                }]
            });

            if (!user) {
                return res.status(401).json({
                    status: 'error',
                    message: 'User not found'
                });
            }

            // Update last_used_at of the refresh token
            await validRefreshToken.update({
                last_used_at: new Date()
            });

            // Attach user and refresh token to request
            req.user = user;
            req.refreshToken = validRefreshToken;
            next();
        } catch (error) {
            console.error('Auth Error:', error);
            
            // Handle specific JWT errors
            if (error instanceof jwt.TokenExpiredError) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Token has expired',
                    code: 'TOKEN_EXPIRED'
                });
            }
            
            if (error instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid token format',
                    code: 'TOKEN_INVALID'
                });
            }

            return res.status(401).json({
                status: 'error',
                message: 'Authentication failed',
                code: 'AUTH_FAILED'
            });
        }
    },

    async revokeUserTokens(userId) {
        try {
            await RefreshToken.update(
                { is_revoked: true },
                { 
                    where: { 
                        user_id: userId,
                        is_revoked: false 
                    } 
                }
            );
        } catch (error) {
            console.error('Error revoking tokens:', error);
            throw error;
        }
    },

    // Role-based middleware remains the same
    async isNormalUser(req, res, next) {
        try {
            if (!req.user || !req.user.Role) {
                return res.status(403).json({
                    status: 'error',
                    message: 'User role not found'
                });
            }
    
            if (req.user.Role.name !== 'user') {
                return res.status(403).json({
                    status: 'error',
                    message: 'Only normal users can access this resource'
                });
            }
    
            next();
        } catch (error) {
            console.error('Role Check Error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error checking user role'
            });
        }
    },

    async isAdminOrSuperAdmin(req, res, next) {
        try {
            if (!req.user || !req.user.Role) {
                return res.status(403).json({
                    status: 'error',
                    message: 'User role not found'
                });
            }

            if (!['admin', 'superadmin'].includes(req.user.Role.name)) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Requires admin or superadmin privileges'
                });
            }

            next();
        } catch (error) {
            console.error('Role Check Error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error checking user role'
            });
        }
    },

    async isSuperAdmin(req, res, next) {
        try {
            if (!req.user || !req.user.Role) {
                return res.status(403).json({
                    status: 'error',
                    message: 'User role not found'
                });
            }

            if (req.user.Role.name !== 'superadmin') {
                return res.status(403).json({
                    status: 'error',
                    message: 'Requires superadmin privileges'
                });
            }

            next();
        } catch (error) {
            console.error('Role Check Error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error checking user role'
            });
        }
    }
};

module.exports = authMiddleware;