const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const { sequelize } = require('./models');
require('dotenv').config();

// API Configuration
const apiEndPoint = process.env.API_END_POINT || '/api';
const apiVersion = process.env.API_VERSION || '/v1';
const baseURL = `${apiEndPoint}${apiVersion}`;

const app = express();

// CORS Configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? [
            'https://your-production-domain.com'
          ]
        : [
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:3000',
            'http://192.168.50.137:5173'

          ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'X-Requested-With',
        'Accept',
        'Origin'
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    exposedHeaders: ['set-cookie']
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Additional CORS headers middleware
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (corsOptions.origin.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', corsOptions.methods.join(','));
    res.setHeader('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(','));
    res.setHeader('Access-Control-Expose-Headers', corsOptions.exposedHeaders.join(','));
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).json({
            status: 'success',
            message: 'OK'
        });
    }
    next();
});

// Cookie Parser middleware with security options
app.use(cookieParser(process.env.COOKIE_SECRET));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/assets', express.static(path.join(__dirname, 'public')));

// Security headers middleware
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
});

// Routes
// health check
const healthRoute = require('./routes/health')(sequelize);
app.use(`${baseURL}/health`, healthRoute);

const pathRoute = require('./routes/path')(sequelize);
app.use(`${baseURL}/path`, pathRoute);

// auth routes
const authRoute = require('./routes/auth');
app.use(`${baseURL}/auth`, authRoute);

// other routes
const categoryRoute = require('./routes/category');
app.use(`${baseURL}/categories`, categoryRoute);

const collectionRoute = require('./routes/collection');
app.use(`${baseURL}/collections`, collectionRoute);

const sizeRoute = require('./routes/size');
app.use(`${baseURL}/sizes`, sizeRoute);

const roleRoute = require('./routes/role');
app.use(`${baseURL}/roles`, roleRoute);

const productRoute = require('./routes/product');
app.use(`${baseURL}/products`, productRoute);

const wishlistRoute = require('./routes/wishlist');
app.use(`${baseURL}/wishlists`, wishlistRoute);

const cartRoute = require('./routes/cart');
app.use(`${baseURL}/carts`, cartRoute);

const addressRoute = require('./routes/address');
app.use(`${baseURL}/addresses`, addressRoute);

const orderRoute = require('./routes/order');
app.use(`${baseURL}/orders`, orderRoute);

const accountRoute = require('./routes/account');
app.use(`${baseURL}/accounts`, accountRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    // Handling specific errors
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid token or no token provided'
        });
    }

    // Generic error response
    res.status(err.status || 500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Cannot ${req.method} ${req.url}`
    });
});

// Server startup
const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await sequelize.sync();
        console.log('Database synced successfully');
        
        app.listen(PORT, () => {
            console.log('=================================');
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log(`📍 API base URL: ${baseURL}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔒 CORS enabled for: ${corsOptions.origin.join(', ')}`);
            console.log('=================================');
        });
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
        process.exit(1);
    }
}

// Start the server
startServer();