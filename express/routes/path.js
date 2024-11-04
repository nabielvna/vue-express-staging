const express = require('express');
const router = express.Router();

function getRoutePaths(app) {
    const routes = [];
    
    function processRoute(route, basePath = '') {
        const path = basePath + (route.path || '');
        
        if (route.route) {
            // If it's a route handler, get its methods
            const methods = Object.keys(route.route.methods)
                .filter(method => route.route.methods[method])
                .map(method => method.toUpperCase());
            
            routes.push({
                path,
                methods,
                middleware: route.route.stack
                    .filter(layer => layer.name !== '<anonymous>')
                    .map(layer => layer.name)
            });
        } else if (route.name === 'router') {
            // If it's a router middleware, process its handle stack
            route.handle.stack.forEach(handler => {
                processRoute(handler, path);
            });
        }
    }
    
    // Process all layers in the main stack
    app._router.stack.forEach(middleware => {
        if (middleware.name === 'router') {
            // Process routes under specific path
            const path = middleware.regexp.toString()
                .replace('/^\\', '')
                .replace('\\/?(?=\\/|$)/i', '')
                .replace(/\\/g, '');
            
            middleware.handle.stack.forEach(handler => {
                processRoute(handler, path);
            });
        }
    });
    
    return routes;
}

module.exports = () => {
    router.get('/', async (req, res) => {
        try {
            const routes = getRoutePaths(req.app);
            
            res.json({
                status: 'OK',
                timestamp: new Date(),
                api: {
                    totalEndpoints: routes.length,
                    endpoints: routes.map(route => ({
                        path: route.path,
                        methods: route.methods,
                        middleware: route.middleware
                    }))
                }
            });
        } catch (error) {
            res.status(500).json({
                status: 'ERROR',
                message: 'Path check failed',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error'
            });
        }
    });

    return router;
};