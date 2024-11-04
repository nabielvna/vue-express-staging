// controllers/authController.js
const { User, Role, Cart, Wishlist, RefreshToken } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

const MAX_ACTIVE_TOKENS = 5;

const generateAccessToken = (user, rememberMe = false) => {
    return jwt.sign(
        { 
            id: user.id,
            email: user.email,
            role_id: user.role_id 
        },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: rememberMe ? '7d' : '24h' }
    );
};

const generateRefreshToken = (user, rememberMe = false) => {
    return jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: rememberMe ? '30d' : '7d' }
    );
};

// Modifikasi storeRefreshToken untuk menambahkan limit check
const storeRefreshToken = async (user, token, req, rememberMe = false) => {
    // Enforce token limit
    await RefreshToken.enforceTokenLimit(user.id, MAX_ACTIVE_TOKENS);
    
    const hashedToken = await bcrypt.hash(token, 10);
    
    await RefreshToken.create({
        id: uuidv4(),
        user_id: user.id,
        token: hashedToken,
        device_info: req.headers['user-agent'],
        ip_address: req.ip,
        expires_at: new Date(Date.now() + (rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000),
        last_used_at: new Date(),
        is_remember_me: rememberMe
    });
};


const signup = async (req, res) => {
    try {
        const {
            email,
            name,
            password,
            phone_number,
            accept_policy
        } = req.body;

        // Validation
        if (!email || !name || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Email, name, and password are required'
            });
        }

        if (!accept_policy) {
            return res.status(400).json({
                status: 'error',
                message: 'You must accept the policy'
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'Email already registered'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Begin transaction
        const result = await User.sequelize.transaction(async (t) => {
            // Create user
            const user = await User.create({
                id: uuidv4(),
                email,
                name,
                password: hashedPassword,
                phone_number,
                accept_policy,
                role_id: 1 
            }, { transaction: t });

            // Create cart
            await Cart.create({
                id: uuidv4(),
                user_id: user.id,
                total_price: 0,
                total_item: 0
            }, { transaction: t });

            // Create wishlist
            await Wishlist.create({
                id: uuidv4(),
                user_id: user.id
            }, { transaction: t });

            return user;
        });

        // Generate tokens
        const accessToken = generateAccessToken(result);
        const refreshToken = generateRefreshToken(result);
        await storeRefreshToken(result, refreshToken, req);

        // Set refresh token cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Get user data with role
        const userData = await User.findOne({
            where: { id: result.id },
            include: [{
                model: Role,
                attributes: ['name']
            }],
            attributes: { exclude: ['password'] }
        });

        return res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: {
                user: userData,
                accessToken
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};

const signin = async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Email and password are required'
            });
        }

        // Find user
        const user = await User.findOne({ 
            where: { email },
            include: [{
                model: Role,
                attributes: ['name']
            }]
        });

        // Check if user exists and verify password
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password'
            });
        }

        await RefreshToken.cleanup();

        // Generate tokens with limit check
        const accessToken = generateAccessToken(user, rememberMe);
        const refreshToken = generateRefreshToken(user, rememberMe);
        await storeRefreshToken(user, refreshToken, req, rememberMe);

        // Set refresh token cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',

            // sameSite: 'strict',
            sameSite: 'lax',
            maxAge: (rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000
        });

        // Remove password from user data
        const userData = user.toJSON();
        delete userData.password;

        return res.status(200).json({
            status: 'success',
            message: 'Signin successful',
            data: {
                user: userData,
                accessToken,
                rememberMe
            }
        });

    } catch (error) {
        console.error('Signin error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};

const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
            
            return res.status(401).json({
                status: 'error',
                message: 'Refresh token not found'
            });
        }

        // Verify refresh token
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Find and validate stored token
        const storedToken = await RefreshToken.findOne({
            where: {
                user_id: payload.id,
                is_revoked: false,
                expires_at: {
                    [Op.gt]: new Date()
                }
            },
            order: [['last_used_at', 'DESC']]
        });

        if (!storedToken || !(await bcrypt.compare(refreshToken, storedToken.token))) {
            // Revoke all tokens for security
            await RefreshToken.revokeAllUserTokens(payload.id);

            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });

            return res.status(401).json({
                status: 'error',
                message: 'Invalid refresh token'
            });
        }

        // Find user
        const user = await User.findByPk(payload.id);
        if (!user) {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });

            return res.status(401).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Update last used timestamp
        await storedToken.update({ 
            last_used_at: new Date(),
            is_revoked: true // Revoke old token
        });

        // Generate new tokens with limit check
        const newAccessToken = generateAccessToken(user, storedToken.is_remember_me);
        const newRefreshToken = generateRefreshToken(user, storedToken.is_remember_me);
        await storeRefreshToken(user, newRefreshToken, req, storedToken.is_remember_me);

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: (storedToken.is_remember_me ? 30 : 7) * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            status: 'success',
            data: {
                accessToken: newAccessToken
            }
        });

    } catch (error) {
        console.error('Refresh token error:', error);
        
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        return res.status(401).json({
            status: 'error',
            message: 'Invalid refresh token'
        });
    }
};

const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            
            // Revoke all tokens and cleanup
            await Promise.all([
                RefreshToken.revokeAllUserTokens(payload.id),
                RefreshToken.cleanup()
            ]);
        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        return res.status(200).json({
            status: 'success',
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(200).json({
            status: 'success',
            message: 'Logged out successfully'
        });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findOne({
            where: { id: req.user.id },
            include: [{
                model: Role,
                attributes: ['name']
            }],
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Sesuaikan format response dengan frontend
        return res.status(200).json({
            status: 'success',
            data: {
                user // Wrap user data dalam property user
            }
        });
    } catch (error) {
        console.error('Get current user error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};

module.exports = {
    signup,
    signin,
    refresh,
    getCurrentUser,
    logout
};