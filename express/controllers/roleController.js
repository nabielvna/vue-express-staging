const { Role, User } = require('../models');
const { sequelize } = require('../models');

const roleController = {
    // Previous methods remain the same
    async getAllRoles(req, res) {
        try {
            // Additional super admin check
            if (req.user.Role.name.toLowerCase() !== 'superadmin') {
                return res.status(403).json({
                    status: 'error',
                    message: 'Only Super Admin can view all roles'
                });
            }

            const roles = await Role.findAll({
                attributes: ['id', 'name', 'created_at', 'updated_at'],
                include: [{
                    model: User,
                    as: 'Users',
                    attributes: ['id', 'name', 'email', 'profile_picture'],
                    include: [{
                        model: Role,
                        as: 'Role',
                        attributes: ['id', 'name']
                    }]
                }]
            });

            return res.status(200).json({
                status: 'success',
                data: roles
            });
        } catch (error) {
            console.error('Error in getAllRoles:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to fetch roles'
            });
        }
    },

    async getRoleById(req, res) {
        try {
            const role = await Role.findByPk(req.params.id, {
                attributes: ['id', 'name', 'created_at', 'updated_at'],
                include: [{
                    model: User,
                    as: 'Users',
                    attributes: ['id', 'name', 'email', 'profile_picture'],
                    include: [{
                        model: Role,
                        as: 'Role',
                        attributes: ['id', 'name']
                    }]
                }]
            });

            if (!role) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Role not found'
                });
            }
            
            return res.status(200).json({
                status: 'success',
                data: role
            });
        } catch (error) {
            console.error('Error in getRoleById:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to fetch role'
            });
        }
    },

    // New method for assigning role to user
    async assignUserRole(req, res) {
        const transaction = await sequelize.transaction();
        
        try {
            // Additional super admin check
            if (req.user.Role.name.toLowerCase() !== 'superadmin') {
                return res.status(403).json({
                    status: 'error',
                    message: 'Only Super Admin can assign roles'
                });
            }

            const { userId, roleId } = req.body;

            if (!userId || !roleId) {
                return res.status(400).json({
                    status: 'error',
                    message: 'User ID and Role ID are required'
                });
            }

            const user = await User.findByPk(userId, {
                include: [{
                    model: Role,
                    as: 'Role'
                }]
            });

            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'User not found'
                });
            }

            const role = await Role.findByPk(roleId);
            if (!role) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Role not found'
                });
            }

            await user.update({ role_id: roleId }, { transaction });

            const updatedUser = await User.findByPk(userId, {
                include: [{
                    model: Role,
                    as: 'Role',
                    attributes: ['id', 'name']
                }],
                transaction
            });

            await transaction.commit();

            return res.status(200).json({
                status: 'success',
                message: 'User role updated successfully',
                data: updatedUser
            });

        } catch (error) {
            await transaction.rollback();
            console.error('Error in assignUserRole:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to update user role'
            });
        }
    }
};

module.exports = roleController;