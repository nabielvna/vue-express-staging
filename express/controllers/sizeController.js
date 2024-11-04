// controllers/sizeController.js
const { Size } = require('../models');
const { v4: uuidv4 } = require('uuid');

const sizeController = {
    async getAllSizes(req, res) {
        try {
            const sizes = await Size.findAll({
                attributes: ['id', 'size'],
                order: [['size', 'ASC']]
            });

            return res.status(200).json({
                status: 'success',
                data: sizes
            });
        } catch (error) {
            console.error('Error getting sizes:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to get sizes'
            });
        }
    },

    async getSizeById(req, res) {
        try {
            const size = await Size.findByPk(req.params.id, {
                attributes: ['id', 'size']
            });

            if (!size) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Size not found'
                });
            }

            return res.status(200).json({
                status: 'success',
                data: size
            });
        } catch (error) {
            console.error('Error getting size:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to get size'
            });
        }
    },

    async createSize(req, res) {
        try {
            const { size } = req.body;

            if (!size) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Size is required'
                });
            }

            // Check if size already exists
            const existingSize = await Size.findOne({
                where: { size }
            });

            if (existingSize) {
                return res.status(409).json({
                    status: 'error',
                    message: 'Size already exists'
                });
            }

            const newSize = await Size.create({ size });

            return res.status(201).json({
                status: 'success',
                message: 'Size created successfully',
                data: newSize
            });
        } catch (error) {
            console.error('Error creating size:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to create size'
            });
        }
    },

    async updateSize(req, res) {
        try {
            const { size } = req.body;
            const { id } = req.params;

            if (!size) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Size is required'
                });
            }

            const existingSize = await Size.findByPk(id);

            if (!existingSize) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Size not found'
                });
            }

            // Check if new size value already exists for different id
            const duplicateSize = await Size.findOne({
                where: { size }
            });

            if (duplicateSize && duplicateSize.id !== parseInt(id)) {
                return res.status(409).json({
                    status: 'error',
                    message: 'Size already exists'
                });
            }

            await existingSize.update({ size });

            return res.status(200).json({
                status: 'success',
                message: 'Size updated successfully',
                data: existingSize
            });
        } catch (error) {
            console.error('Error updating size:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to update size'
            });
        }
    },

    async deleteSize(req, res) {
        try {
            const size = await Size.findByPk(req.params.id);

            if (!size) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Size not found'
                });
            }

            await size.destroy();

            return res.status(200).json({
                status: 'success',
                message: 'Size deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting size:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to delete size'
            });
        }
    }
};

module.exports = sizeController;