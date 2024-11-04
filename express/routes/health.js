const express = require('express');
const router = express.Router();

module.exports = (sequelize) => {
    router.get('/', async (req, res) => {
        try {
            // Check database connection
            const dbStatus = await sequelize.authenticate()
                .then(() => 'Connected')
                .catch(() => 'Disconnected');
            
            res.json({
                status: 'OK',
                timestamp: new Date(),
                server: {
                    uptime: process.uptime(),
                    message: 'Server is healthy',
                    baseURL: process.env.API_END_POINT + process.env.API_VERSION,
                    environment: process.env.NODE_ENV || 'development'
                },
                database: {
                    status: dbStatus,
                    name: sequelize.config.database
                }
            });
        } catch (error) {
            res.status(500).json({
                status: 'ERROR',
                message: 'Health check failed',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error'
            });
        }
    });

    return router;
};