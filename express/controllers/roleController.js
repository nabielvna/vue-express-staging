const { Role } = require('../models');

const roleController = {
    // Get all roles
    async getAllRoles(req, res) {
        try {
            const roles = await Role.findAll({
                attributes: ['id', 'name', 'created_at', 'updated_at']
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

    // Get role by ID
    async getRoleById(req, res) {
        try {
            const role = await Role.findByPk(req.params.id, {
                attributes: ['id', 'name', 'created_at', 'updated_at']
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
    }
};

module.exports = roleController;