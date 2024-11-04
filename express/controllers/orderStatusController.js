// orderStatusController.js
const { OrderStatus } = require('../models');

const orderStatusController = {
    // Get all order statuses
    async getOrderStatuses(req, res) {
        try {
            const orderStatuses = await OrderStatus.findAll({
                order: [['id', 'ASC']]
            });

            if (orderStatuses.length === 0) {
                return res.status(200).json({
                    status: 'success',
                    message: 'No order statuses found',
                    data: [],
                    total: 0
                });
            }

            return res.status(200).json({
                status: 'success',
                data: orderStatuses,
                total: orderStatuses.length
            });
        } catch (error) {
            console.error('Get Order Statuses Error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error retrieving order statuses'
            });
        }
    },

    // Get single order status
    async getOrderStatus(req, res) {
        try {
            const orderStatus = await OrderStatus.findByPk(req.params.id);

            if (!orderStatus) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Order status not found'
                });
            }

            return res.status(200).json({
                status: 'success',
                data: orderStatus
            });
        } catch (error) {
            console.error('Get Order Status Error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error retrieving order status'
            });
        }
    },

    // Create new order status
    async createOrderStatus(req, res) {
        try {
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Order status name is required'
                });
            }

            // Check if order status with same name already exists
            const existingStatus = await OrderStatus.findOne({
                where: { name }
            });

            if (existingStatus) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Order status with this name already exists'
                });
            }

            const orderStatus = await OrderStatus.create({
                name
            });

            return res.status(201).json({
                status: 'success',
                data: orderStatus,
                message: 'Order status created successfully'
            });
        } catch (error) {
            console.error('Create Order Status Error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error creating order status'
            });
        }
    },

    // Update order status
    async updateOrderStatus(req, res) {
        try {
            const { name } = req.body;
            
            const orderStatus = await OrderStatus.findByPk(req.params.id);

            if (!orderStatus) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Order status not found'
                });
            }

            if (!name) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Order status name is required'
                });
            }

            // Check if another order status with same name exists
            const existingStatus = await OrderStatus.findOne({
                where: { 
                    name,
                    id: { 
                        [OrderStatus.sequelize.Op.ne]: req.params.id 
                    }
                }
            });

            if (existingStatus) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Another order status with this name already exists'
                });
            }

            await orderStatus.update({ name });

            return res.status(200).json({
                status: 'success',
                data: orderStatus,
                message: 'Order status updated successfully'
            });
        } catch (error) {
            console.error('Update Order Status Error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error updating order status'
            });
        }
    },

    // Delete order status
    async deleteOrderStatus(req, res) {
        try {
            const orderStatus = await OrderStatus.findByPk(req.params.id);

            if (!orderStatus) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Order status not found'
                });
            }

            // Check if the order status is being used by any orders
            const ordersCount = await orderStatus.countOrders();
            
            if (ordersCount > 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Cannot delete order status that is being used by orders'
                });
            }

            await orderStatus.destroy();

            return res.status(200).json({
                status: 'success',
                message: 'Order status deleted successfully'
            });
        } catch (error) {
            console.error('Delete Order Status Error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error deleting order status'
            });
        }
    }
};

module.exports = orderStatusController;