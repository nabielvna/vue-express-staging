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
    Address,
    User,
    sequelize
} = require('../models');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

const orderController = {
    // Admin: Get all orders
    async getAllOrders(req, res) {
        try {
            const { 
                page = 1, 
                limit = 10, 
                status,
                search,
                start_date,
                end_date,
                sort = 'created_at',
                order = 'DESC'
            } = req.query;
            
            const offset = (page - 1) * limit;
    
            // Build where clause
            const whereClause = {};
            if (status) {
                whereClause.order_status_id = status;
            }
            
            // Add date range filter
            if (start_date || end_date) {
                whereClause.created_at = {};
                if (start_date) {
                    whereClause.created_at[Op.gte] = new Date(start_date);
                }
                if (end_date) {
                    whereClause.created_at[Op.lte] = new Date(end_date);
                }
            }

            // Get counts by status
            const [statusCounts] = await sequelize.query(`
                SELECT 
                    os.name,
                    COUNT(DISTINCT o.id) as count
                FROM order_statuses os
                LEFT JOIN orders o ON os.id = o.order_status_id 
                GROUP BY os.id, os.name
                ORDER BY os.id
            `);
    
            // Get total count
            const totalOrders = await Order.count({
                where: whereClause,
                include: search ? [{
                    model: User,
                    where: {
                        [Op.or]: [
                            { name: { [Op.like]: `%${search}%` } },
                            { email: { [Op.like]: `%${search}%` } }
                        ]
                    }
                }] : undefined
            });
    
            // Get paginated orders with full details
            const orders = await Order.findAll({
                where: whereClause,
                attributes: [
                    'id', 
                    'total_price', 
                    'total_item', 
                    'created_at', 
                    'updated_at'
                ],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'name', 'email'],
                        where: search ? {
                            [Op.or]: [
                                { name: { [Op.like]: `%${search}%` } },
                                { email: { [Op.like]: `%${search}%` } }
                            ]
                        } : undefined
                    },
                    {
                        model: OrderStatus,
                        attributes: ['id', 'name']
                    },
                    {
                        model: OrderItem,
                        attributes: ['id', 'quantity'],
                        include: [{
                            model: ProductSize,
                            as: 'ProductSize',
                            attributes: ['id', 'stock'],
                            include: [{
                                model: Product,
                                attributes: ['id', 'name', 'price', 'description'],
                                include: [{
                                    model: ProductAsset,
                                    attributes: ['id', 'asset', 'asset_url']
                                }]
                            }, {
                                model: Size,
                                attributes: ['id', 'size']
                            }]
                        }]
                    },
                    {
                        model: Address,
                        attributes: [
                            'id', 
                            'name', 
                            'street_address', 
                            'subdistrict',
                            'city', 
                            'district', 
                            'postal_code', 
                            'province', 
                            'country'
                        ]
                    }
                ],
                limit: parseInt(limit),
                offset,
                order: [[sort, order]]
            });
    
            // Transform status summary
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
            console.error('Get Orders Error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve orders'
            });
        }
    },

    // Admin: Get order by ID
    async getOrderById(req, res) {
        try {
            const order = await Order.findOne({
                where: {
                    id: req.params.id
                },
                attributes: ['id', 'total_price', 'total_item', 'created_at', 'updated_at'],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'name', 'email', 'phone_number']
                    },
                    {
                        model: OrderStatus,
                        attributes: ['id', 'name']
                    },
                    {
                        model: OrderItem,
                        attributes: ['id', 'quantity'],
                        include: [{
                            model: ProductSize,
                            as: 'ProductSize',
                            attributes: ['id', 'stock'],
                            include: [{
                                model: Product,
                                attributes: ['id', 'name', 'price', 'description'],
                                include: [{
                                    model: ProductAsset,
                                    attributes: ['id', 'asset', 'asset_url']
                                }]
                            }, {
                                model: Size,
                                attributes: ['id', 'size']
                            }]
                        }]
                    },
                    {
                        model: Address,
                        attributes: [
                            'id', 
                            'name', 
                            'street_address', 
                            'subdistrict',
                            'city', 
                            'district', 
                            'postal_code', 
                            'province', 
                            'country'
                        ]
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
            console.error('Get Order By ID Error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve order details'
            });
        }
    },

    // Admin: Update order status
    async updateOrderStatus(req, res) {
        const transaction = await sequelize.transaction();

        try {
            const { id } = req.params;
            const { order_status_id } = req.body;

            if (!order_status_id) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Order status is required'
                });
            }

            // Verify order exists
            const order = await Order.findByPk(id);
            if (!order) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Order not found'
                });
            }

            // Verify status exists
            const statusExists = await OrderStatus.findByPk(order_status_id);
            if (!statusExists) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Invalid order status'
                });
            }

            // Update order status
            await order.update({
                order_status_id
            }, { transaction });

            // Commit transaction
            await transaction.commit();

            // Fetch updated order
            const updatedOrder = await Order.findOne({
                where: { id },
                include: [
                    {
                        model: OrderStatus,
                        attributes: ['id', 'name']
                    }
                ]
            });

            return res.status(200).json({
                status: 'success',
                message: 'Order status updated successfully',
                data: updatedOrder
            });

        } catch (error) {
            if (!transaction.finished) {
                await transaction.rollback();
            }
            
            console.error('Update Order Status Error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to update order status'
            });
        }
    },

    // User: Get my orders
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
    
            const totalOrders = await Order.count({
                where: whereClause
            });
    
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

    // User: Get my order by ID
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

    // User: Create new order
    async createOrder(req, res) {
        const transaction = await sequelize.transaction();

        try {
            const userId = req.user.id;
            const { address_id } = req.body;

            if (!address_id) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Address ID is required'
                });
            }

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

            const order = await Order.create({
                id: uuidv4(),
                user_id: userId,
                address_id: address_id,
                total_price: totalPrice,
                total_item: totalItems,
                order_status_id: 1 // Pending/New
            }, { transaction });

            for (const item of cart.CartItems) {
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
                                    attributes: ['id', 'asset', 'asset_url']
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
    },

    // Admin: Export orders
    async exportOrders(req, res) {
        try {
            const { start_date, end_date, status } = req.query;

            // Build where clause for filtering
            const whereClause = {};
            if (status) {
                whereClause.order_status_id = status;
            }
            
            if (start_date || end_date) {
                whereClause.created_at = {};
                if (start_date) {
                    whereClause.created_at[Op.gte] = new Date(start_date);
                }
                if (end_date) {
                    whereClause.created_at[Op.lte] = new Date(end_date);
                }
            }

            // Fetch orders with all necessary data
            const orders = await Order.findAll({
                where: whereClause,
                include: [
                    {
                        model: User,
                        attributes: ['name', 'email', 'phone_number']
                    },
                    {
                        model: OrderStatus,
                        attributes: ['name']
                    },
                    {
                        model: OrderItem,
                        include: [{
                            model: ProductSize,
                            as: 'ProductSize',
                            include: [{
                                model: Product,
                                attributes: ['name', 'price']
                            }, {
                                model: Size,
                                attributes: ['size']
                            }]
                        }]
                    },
                    {
                        model: Address,
                        attributes: [
                            'name', 'street_address', 'subdistrict',
                            'city', 'district', 'postal_code', 'province'
                        ]
                    }
                ],
                order: [['created_at', 'DESC']]
            });

            // Transform orders data for export
            const exportData = orders.map(order => {
                const items = order.OrderItems.map(item => ({
                    product: item.ProductSize.Product.name,
                    size: item.ProductSize.Size.size,
                    quantity: item.quantity,
                    price: item.ProductSize.Product.price,
                    subtotal: item.quantity * item.ProductSize.Product.price
                }));

                return {
                    order_id: order.id,
                    date: order.created_at,
                    customer_name: order.User.name,
                    customer_email: order.User.email,
                    customer_phone: order.User.phone_number,
                    status: order.OrderStatus.name,
                    shipping_address: `${order.Address.street_address}, ${order.Address.subdistrict}, ${order.Address.city}, ${order.Address.province} ${order.Address.postal_code}`,
                    items,
                    total_items: order.total_item,
                    total_price: order.total_price
                };
            });

            return res.status(200).json({
                status: 'success',
                data: exportData
            });

        } catch (error) {
            console.error('Export Orders Error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to export orders'
            });
        }
    }
};

module.exports = orderController;