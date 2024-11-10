// controllers/orderController.js
const { 
    Order, 
    OrderItem, 
    OrderStatus, 
    Product, 
    ProductSize, 
    ProductAsset,
    Size,   
    Cart, 
    CartItem,
    Address
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
    
            // Get counts by status
            const [statusCounts] = await sequelize.query(`
                SELECT 
                    os.name,
                    COUNT(DISTINCT o.id) as count
                FROM order_statuses os
                LEFT JOIN orders o ON os.id = o.order_status_id 
                    AND o.user_id = '${req.user.id}'
                GROUP BY os.id, os.name
                ORDER BY os.id
            `);
    
            // Get total count first
            const totalOrders = await Order.count({
                where: whereClause
            });
    
            // Get paginated orders with details
            const orders = await Order.findAll({
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
    
            // Transform summary to object format
            const summary = statusCounts.reduce((acc, curr) => {
                acc[curr.name] = parseInt(curr.count);
                return acc;
            }, {});
    
            return res.status(200).json({
                status: 'success',
                data: {
                    orders,
                    summary,
                    pagination: {
                        total: totalOrders,
                        page: parseInt(page),
                        total_pages: Math.ceil(totalOrders / limit)
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
            const { address_id } = req.body;

            // Validate address_id
            if (!address_id) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Address ID is required'
                });
            }

            // Verify address belongs to user
            const address = await Address.findOne({
                where: {
                    id: address_id,
                    user_id: userId
                }
            });

            if (!address) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Invalid address'
                });
            }

            // Get user's cart with items
            const cart = await Cart.findOne({
                where: { user_id: userId },
                include: [{
                    model: CartItem,
                    include: [{
                        model: ProductSize,
                        as: 'ProductSize',
                        include: [{
                            model: Product
                        }]
                    }]
                }]
            });

            if (!cart || !cart.CartItems.length) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Cart is empty'
                });
            }

            // Verify stock availability and calculate totals
            let totalPrice = 0;
            let totalItems = 0;

            for (const item of cart.CartItems) {
                const productSize = await ProductSize.findByPk(item.product_size_id);
                if (!productSize || item.quantity > productSize.stock) {
                    return res.status(400).json({
                        status: 'error',
                        message: `Insufficient stock for ${item.ProductSize.Product.name}`
                    });
                }
                totalPrice += Number(item.ProductSize.Product.price) * item.quantity;
                totalItems += item.quantity;
            }

            // Create order
            const order = await Order.create({
                id: uuidv4(),
                user_id: userId,
                address_id: address_id,
                total_price: totalPrice,
                total_item: totalItems,
                order_status_id: 1 // Pending/New
            }, { transaction });

            // Create order items and update stock
            for (const item of cart.CartItems) {
                // Create order item
                await OrderItem.create({
                    id: uuidv4(),
                    order_id: order.id,
                    product_size_id: item.product_size_id,
                    quantity: item.quantity
                }, { transaction });

                // Update stock
                await ProductSize.decrement('stock', {
                    by: item.quantity,
                    where: { id: item.product_size_id },
                    transaction
                });
            }

            // Clear cart items
            await CartItem.destroy({
                where: { cart_id: cart.id },
                transaction
            });

            // Reset cart totals
            await cart.update({
                total_price: 0,
                total_item: 0
            }, { transaction });

            // Commit transaction
            await transaction.commit();

            // Fetch complete order with correct associations
            const completeOrder = await Order.findOne({
                where: { id: order.id },
                attributes: ['id', 'total_price', 'total_item', 'created_at', 'updated_at'],
                include: [
                    {
                        model: OrderStatus,
                        attributes: ['id', 'name']
                    },
                    {
                        model: OrderItem,
                        attributes: ['id', 'quantity', 'order_id', 'product_size_id'],
                        include: [{
                            model: ProductSize,
                            as: 'ProductSize',
                            attributes: ['id', 'stock'],
                            include: [{
                                model: Product,
                                attributes: ['id', 'name', 'description', 'price'],
                                include: [{
                                    model: ProductAsset,
                                    attributes: ['id', 'asset']
                                }]
                            }]
                        }]
                    },
                    {
                        model: Address,
                        attributes: [
                            'id', 'name', 'street_address', 'subdistrict', 
                            'city', 'district', 'postal_code', 'province', 'country'
                        ]
                    }
                ]
            });
            
            if (!completeOrder) {
                throw new Error('Failed to retrieve created order');
            }
            
            return res.status(201).json({
                status: 'success',
                message: 'Order created successfully',
                data: completeOrder
            });

        } catch (error) {
            // Only rollback if transaction hasn't been committed
            if (!transaction.finished) {
                await transaction.rollback();
            }
            
            console.error('Create Order Error:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message || 'Failed to create order'
            });
        }
    }
};

module.exports = orderController;