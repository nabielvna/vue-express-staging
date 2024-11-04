const { Address, User } = require('../models');
const { v4: uuidv4 } = require('uuid');

const addressController = {
    // Get all addresses for authenticated user
    async getAddresses(req, res) {
        try {
            const addresses = await Address.findAll({
                where: { user_id: req.user.id },
                order: [['created_at', 'DESC']]
            });

            // Check if addresses exist
            if (addresses.length === 0) {
                return res.status(200).json({
                    status: 'success',
                    message: 'No addresses found for this user',
                    data: [],
                    total: 0
                });
            }

            return res.status(200).json({
                status: 'success',
                data: addresses,
                total: addresses.length
            });
        } catch (error) {
            console.error('Get Addresses Error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error retrieving addresses'
            });
        }
    },

    // Get single address
    async getAddress(req, res) {
        try {
            const address = await Address.findOne({
                where: {
                    id: req.params.id,
                    user_id: req.user.id
                }
            });

            if (!address) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Address not found'
                });
            }

            return res.status(200).json({
                status: 'success',
                data: address
            });
        } catch (error) {
            console.error('Get Address Error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error retrieving address'
            });
        }
    },

    // Create new address
    async createAddress(req, res) {
        try {
            const {
                name,
                street_address,
                subdistrict,
                city,
                district,
                postal_code,
                province,
                country
            } = req.body;

            // Validate required fields
            if (!street_address || !city || !postal_code) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Street address, city, and postal code are required'
                });
            }

            const address = await Address.create({
                id: uuidv4(),
                name,
                street_address,
                subdistrict,
                city,
                district,
                postal_code,
                province,
                country,
                user_id: req.user.id
            });

            return res.status(201).json({
                status: 'success',
                data: address
            });
        } catch (error) {
            console.error('Create Address Error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error creating address'
            });
        }
    },

    // Update address
    async updateAddress(req, res) {
        try {
            const {
                name,
                street_address,
                subdistrict,
                city,
                district,
                postal_code,
                province,
                country
            } = req.body;

            const address = await Address.findOne({
                where: {
                    id: req.params.id,
                    user_id: req.user.id
                }
            });

            if (!address) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Address not found'
                });
            }

            // Update address
            await address.update({
                name,
                street_address,
                subdistrict,
                city,
                district,
                postal_code,
                province,
                country
            });

            return res.status(200).json({
                status: 'success',
                data: address
            });
        } catch (error) {
            console.error('Update Address Error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error updating address'
            });
        }
    },

    // Delete address
    async deleteAddress(req, res) {
        try {
            const address = await Address.findOne({
                where: {
                    id: req.params.id,
                    user_id: req.user.id
                }
            });

            if (!address) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Address not found'
                });
            }

            await address.destroy();

            return res.status(200).json({
                status: 'success',
                message: 'Address deleted successfully'
            });
        } catch (error) {
            console.error('Delete Address Error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error deleting address'
            });
        }
    }
};

module.exports = addressController;