// controllers/orderController.js
const { 
    Order, 
    OrderItem, 
    OrderStatus, 
    Product, 
    ProductSize, 
    ProductAsset,
    Size,  
    User, 
    Cart, 
    CartItem 
} = require('../models');
const { v4: uuidv4 } = require('uuid');
const { sequelize } = require('../models');

const orderController = {
    // Get user's orders
    async getMyOrders(req, res) {
        try {
            const { page = 1, limit = 10, status } = req.query;
            const offset = (page - 1) * limit;

            const whereClause = {
                user_id: req.user.id
            };
            if (status) {
                whereClause.order_status_id = status;
            }

            const { count, rows: orders } = await Order.findAndCountAll({
                where: whereClause,
                attributes: ['id', 'total_price', 'total_item', 'created_at', 'updated_at'],
                include: [
                    {
                        model: OrderStatus,
                        attributes: ['name']
                    },
                    {
                        model: OrderItem,
                        attributes: ['id', 'quantity'],
                        include: [{
                            model: ProductSize,
                            as: 'ProductSize',
                            attributes: ['stock'],
                            include: [{
                                model: Product,
                                attributes: ['name', 'price', 'description'],
                                include: [{
                                    model: ProductAsset,
                                    attributes: ['asset', 'asset_url']
                                }]
                            }, {
                                model: Size,
                                attributes: ['size']
                            }]
                        }]
                    }
                ],
                limit: parseInt(limit),
                offset,
                order: [['created_at', 'DESC']]
            });

            return res.status(200).json({
                status: 'success',
                data: {
                    orders,
                    pagination: {
                        total: count,
                        page: parseInt(page),
                        total_pages: Math.ceil(count / limit)
                    }
                }
            });
        } catch (error) {
            console.error('Get My Orders Error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve your orders'
            });
        }
    },

    // Get specific order by ID (user)
    async getMyOrderById(req, res) {
        try {
            const order = await Order.findOne({
                where: {
                    id: req.params.id,
                    user_id: req.user.id
                },
                attributes: ['id', 'total_price', 'total_item', 'created_at', 'updated_at'],
                include: [
                    {
                        model: OrderStatus,
                        attributes: ['name']
                    },
                    {
                        model: OrderItem,
                        attributes: ['id', 'quantity'],
                        include: [{
                            model: ProductSize,
                            as: 'ProductSize',
                            attributes: ['stock'],
                            include: [{
                                model: Product,
                                attributes: ['name', 'price', 'description'],
                                include: [{
                                    model: ProductAsset,
                                    attributes: ['asset', 'asset_url']
                                }]
                            }, {
                                model: Size,
                                attributes: ['size']
                            }]
                        }]
                    }
                ]
            });

            if (!order) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Order not found'
                });
            }

            return res.status(200).json({
                status: 'success',
                data: order
            });
        } catch (error) {
            console.error('Get My Order By ID Error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve order'
            });
        }
    },

    // Create new order from cart
    async createOrder(req, res) {
        const transaction = await sequelize.transaction();

        try {
            const userId = req.user.id;

            // Get user's cart with items
            const cart = await Cart.findOne({
                where: { user_id: userId },
                include: [{
                    model: CartItem,
                    include: [{
                        model: ProductSize,
                        as: 'ProductSize',
                        include: [{
                            model: Product,
                            attributes: ['name', 'price']
                        }]
                    }]
                }]
            });

            if (!cart || !cart.CartItems.length) {
                await transaction.rollback();
                return res.status(400).json({
                    status: 'error',
                    message: 'Cart is empty'
                });
            }

            // Validate stock availability and calculate totals
            let totalPrice = 0;
            let totalItem = 0;

            for (const item of cart.CartItems) {
                if (item.quantity > item.ProductSize.stock) {
                    await transaction.rollback();
                    return res.status(400).json({
                        status: 'error',
                        message: `Insufficient stock for product: ${item.ProductSize.Product.name}`
                    });
                }
                totalPrice += Number(item.ProductSize.Product.price) * item.quantity;
                totalItem += item.quantity;
            }

            // Create order
            const order = await Order.create({
                id: uuidv4(),
                user_id: userId,
                total_price: totalPrice,
                total_item: totalItem,
                order_status_id: 1 // Pending/New
            }, { transaction });

            // Create order items and update stock
            for (const item of cart.CartItems) {
                await OrderItem.create({
                    id: uuidv4(),
                    order_id: order.id,
                    product_size_id: item.product_size_id,
                    quantity: item.quantity
                }, { transaction });

                await ProductSize.decrement('stock', {
                    by: item.quantity,
                    where: { id: item.product_size_id },
                    transaction
                });
            }

            // Clear cart
            await CartItem.destroy({
                where: { cart_id: cart.id },
                transaction
            });

            await cart.update({
                total_price: 0,
                total_item: 0
            }, { transaction });

            await transaction.commit();

            // Get complete order with associations
            const completeOrder = await Order.findByPk(order.id, {
                attributes: ['id', 'total_price', 'total_item', 'created_at', 'updated_at'],
                include: [
                    {
                        model: OrderStatus,
                        attributes: ['name']
                    },
                    {
                        model: OrderItem,
                        attributes: ['id', 'quantity'],
                        include: [{
                            model: ProductSize,
                            as: 'ProductSize',
                            attributes: ['stock'],
                            include: [{
                                model: Product,
                                attributes: ['name', 'price', 'description'],
                                include: [{
                                    model: ProductAsset,
                                    attributes: ['asset', 'asset_url']
                                }]
                            }, {
                                model: Size,
                                attributes: ['size']
                            }]
                        }]
                    }
                ]
            });

            return res.status(201).json({
                status: 'success',
                message: 'Order created successfully',
                data: completeOrder
            });

        } catch (error) {
            await transaction.rollback();
            console.error('Create Order Error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to create order'
            });
        }
    },
};

module.exports = orderController;