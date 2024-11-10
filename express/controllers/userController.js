const { User, Role } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const fileService = require('../services/fileService');

const userController = {
    // Get all users with filtering and pagination
    async getAllUsers(req, res) {
        try {
            const { 
                page = 1, 
                limit = 10,
                search = '',
                role,
                status 
            } = req.query;

            // Build where clause
            const whereClause = {};
            
            if (search) {
                whereClause[Op.or] = [
                    { name: { [Op.like]: `%${search}%` } },
                    { email: { [Op.like]: `%${search}%` } }
                ];
            }

            if (role) {
                whereClause['$Role.name$'] = role;
            }

            // Calculate offset
            const offset = (page - 1) * limit;

            // Get users with pagination
            const { count, rows: users } = await User.findAndCountAll({
                where: whereClause,
                include: [{
                    model: Role,
                    attributes: ['name']
                }],
                attributes: [
                    'id', 
                    'name', 
                    'email', 
                    'nickname',
                    'phone_number',
                    'profile_picture',
                    'created_at',
                    'updated_at'
                ],
                order: [['created_at', 'DESC']],
                limit: parseInt(limit),
                offset: offset,
                distinct: true
            });

            // Format user data with explicit mapping
            const formattedUsers = users.map(user => {
                const userData = user.toJSON();
                return {
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    nickname: userData.nickname,
                    phone_number: userData.phone_number,
                    profile_picture: userData.profile_picture 
                        ? `${process.env.BASE_URL}/assets/profiles/${userData.profile_picture}`
                        : null,
                    role: userData.Role.name,
                    created_at: userData.created_at,
                    updated_at: userData.updated_at
                };
            });

            return res.status(200).json({
                status: 'success',
                data: {
                    users: formattedUsers,
                    pagination: {
                        total: count,
                        page: parseInt(page),
                        totalPages: Math.ceil(count / limit)
                    }
                }
            });

        } catch (error) {
            console.error('Error getting users:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve users'
            });
        }
    },

    // Get single user by ID
    async getUserById(req, res) {
        try {
            const user = await User.findByPk(req.params.id, {
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

            return res.status(200).json({
                status: 'success',
                data: user
            });

        } catch (error) {
            console.error('Error getting user:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve user'
            });
        }
    },

    // Create new user
    async createUser(req, res) {
        try {
            const {
                email,
                name,
                password,
                phone_number,
                role_id
            } = req.body;

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

            // Handle profile picture if uploaded
            let profilePicture = null;
            if (req.file) {
                profilePicture = await fileService.saveFiles(req.file, 'profiles');
            }

            // Create user
            const user = await User.create({
                id: uuidv4(),
                email,
                name,
                password: hashedPassword,
                phone_number,
                profile_picture: profilePicture,
                role_id,
                accept_policy: true // Set to true for admin-created users
            });

            // Get user with role
            const userWithRole = await User.findByPk(user.id, {
                include: [{
                    model: Role,
                    attributes: ['name']
                }],
                attributes: { exclude: ['password'] }
            });

            return res.status(201).json({
                status: 'success',
                message: 'User created successfully',
                data: userWithRole
            });

        } catch (error) {
            console.error('Error creating user:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to create user'
            });
        }
    },

    // Update user
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const {
                name,
                phone_number,
                password
            } = req.body;

            const user = await User.findByPk(id);

            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'User not found'
                });
            }

            // Handle profile picture update if provided
            let profilePicture = user.profile_picture;
            if (req.file) {
                // Delete old profile picture if exists
                if (user.profile_picture) {
                    await fileService.deleteFiles(user.profile_picture, 'profiles');
                }
                profilePicture = await fileService.saveFiles(req.file, 'profiles');
            }

            // Prepare update data
            const updateData = {
                name,
                phone_number,
                profile_picture: profilePicture
            };

            // Handle password update if provided
            if (password) {
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(password, salt);
            }

            // Update user
            await user.update(updateData);

            // Get updated user with role
            const updatedUser = await User.findByPk(id, {
                include: [{
                    model: Role,
                    attributes: ['name']
                }],
                attributes: { exclude: ['password'] }
            });

            return res.status(200).json({
                status: 'success',
                message: 'User updated successfully',
                data: updatedUser
            });

        } catch (error) {
            console.error('Error updating user:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to update user'
            });
        }
    },

    // Update user role
    async updateUserRole(req, res) {
        try {
            const { id } = req.params;
            const { role_id } = req.body;

            // Check if user exists
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'User not found'
                });
            }

            // Check if role exists
            const role = await Role.findByPk(role_id);
            if (!role) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Role not found'
                });
            }

            // Update user's role
            await user.update({ role_id });

            // Get updated user with role
            const updatedUser = await User.findByPk(id, {
                include: [{
                    model: Role,
                    attributes: ['name']
                }],
                attributes: { exclude: ['password'] }
            });

            return res.status(200).json({
                status: 'success',
                message: 'User role updated successfully',
                data: updatedUser
            });

        } catch (error) {
            console.error('Error updating user role:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to update user role'
            });
        }
    },

    // Delete user
    async deleteUser(req, res) {
        try {
            const { id } = req.params;

            const user = await User.findByPk(id);

            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'User not found'
                });
            }

            // Delete profile picture if exists
            if (user.profile_picture) {
                await fileService.deleteFiles(user.profile_picture, 'profiles');
            }

            // Delete user
            await user.destroy();

            return res.status(200).json({
                status: 'success',
                message: 'User deleted successfully'
            });

        } catch (error) {
            console.error('Error deleting user:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to delete user'
            });
        }
    }
};

module.exports = userController;