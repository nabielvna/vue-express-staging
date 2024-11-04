const { Wishlist, WishlistItem, Product, ProductAsset } = require('../models');
const { v4: uuidv4 } = require('uuid');

const wishlistController = {
    // Get user's wishlist with products
    async getWishlist(req, res) {
        try {
            const userId = req.user.id;
            const {
                search = '',
                collection_id,
                category_id,
                min_price,
                max_price,
                sort_by = 'updatedAt', // Default sort by wishlist updatedAt
                sort_direction = 'DESC', // Default newest first
                is_available
            } = req.query;
    
            // Find or create wishlist for user
            let [wishlist] = await Wishlist.findOrCreate({
                where: { user_id: userId },
                defaults: {
                    id: uuidv4()
                }
            });
    
            // Build product where clause for filtering
            const productWhereClause = {};
            
            if (search) {
                productWhereClause.name = { [Op.like]: `%${search}%` };
            }
            if (collection_id) {
                productWhereClause.collection_id = collection_id;
            }
            if (category_id) {
                productWhereClause.category_id = category_id;
            }
            if (min_price || max_price) {
                productWhereClause.price = {};
                if (min_price) productWhereClause.price[Op.gte] = min_price;
                if (max_price) productWhereClause.price[Op.lte] = max_price;
            }
    
            // Prepare include models with filtering
            const productInclude = [{
                model: ProductAsset,
                attributes: ['asset', 'asset_url']
            }];
    
            // Add Size include if filtering by availability
            if (is_available) {
                productInclude.push({
                    model: Size,
                    through: { attributes: ['stock'] }
                });
            }
    
            // Get wishlist with filtered products
            const wishlistWithItems = await Wishlist.findOne({
                where: { id: wishlist.id },
                include: [{
                    model: Product,
                    where: Object.keys(productWhereClause).length > 0 ? productWhereClause : undefined,
                    include: productInclude,
                    through: { attributes: [] }, // Excludes junction table attributes
                    having: is_available ? 
                        is_available === 'true' ? 
                            Sequelize.literal('SUM(Sizes.ProductSize.stock) > 0') :
                            Sequelize.literal('SUM(Sizes.ProductSize.stock) = 0') 
                        : undefined,
                    group: is_available ? ['Product.id'] : undefined
                }],
                order: [
                    // Sort by the specified field or default to updatedAt
                    [{ model: Product }, sort_by.includes('.') ? sort_by.split('.')[1] : sort_by, sort_direction],
                    [{ model: Product }, 'id', 'DESC'] // Secondary sort for consistency
                ]
            });
    
            // If no items found after filtering, return empty products array
            if (!wishlistWithItems) {
                return res.status(200).json({
                    status: 'success',
                    data: {
                        id: wishlist.id,
                        user_id: userId,
                        Products: []
                    }
                });
            }
    
            return res.status(200).json({
                status: 'success',
                data: wishlistWithItems
            });
    
        } catch (error) {
            console.error('Error in getWishlist:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error retrieving wishlist'
            });
        }
    },

    // Add product to wishlist
    async addToWishlist(req, res) {
        try {
            const userId = req.user.id;
            const { productId } = req.params;

            // Verify product exists
            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Product not found'
                });
            }

            // Find or create wishlist
            let [wishlist] = await Wishlist.findOrCreate({
                where: { user_id: userId },
                defaults: {
                    id: uuidv4()
                }
            });

            // Add product to wishlist with explicit values
            const [wishlistItem, created] = await WishlistItem.findOrCreate({
                where: {
                    wishlist_id: wishlist.id,
                    product_id: productId
                },
                defaults: {
                    wishlist_id: wishlist.id,
                    product_id: productId
                }
            });

            return res.status(created ? 201 : 200).json({
                status: 'success',
                message: created ? 'Product added to wishlist' : 'Product already in wishlist'
            });

        } catch (error) {
            console.error('Error in addToWishlist:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error adding product to wishlist',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Remove product from wishlist
    async removeFromWishlist(req, res) {
        try {
            const userId = req.user.id;
            const { productId } = req.params;

            // Get user's wishlist
            const wishlist = await Wishlist.findOne({
                where: { user_id: userId }
            });

            if (!wishlist) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Wishlist not found'
                });
            }

            // Remove product from wishlist
            const deleted = await WishlistItem.destroy({
                where: {
                    wishlist_id: wishlist.id,
                    product_id: productId
                }
            });

            if (!deleted) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Product not found in wishlist'
                });
            }

            return res.status(200).json({
                status: 'success',
                message: 'Product removed from wishlist'
            });

        } catch (error) {
            console.error('Error in removeFromWishlist:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error removing product from wishlist'
            });
        }
    },

    async clearWishlist(req, res) {
        try {
            const userId = req.user.id;

            // Get user's wishlist
            const wishlist = await Wishlist.findOne({
                where: { user_id: userId }
            });

            if (!wishlist) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Wishlist not found'
                });
            }

            // Remove all items from wishlist
            const deleted = await WishlistItem.destroy({
                where: {
                    wishlist_id: wishlist.id
                }
            });

            if (!deleted) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Wishlist is already empty'
                });
            }

            return res.status(200).json({
                status: 'success',
                message: 'All items removed from wishlist',
                data: {
                    deleted_count: deleted
                }
            });

        } catch (error) {
            console.error('Error in clearWishlist:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error clearing wishlist',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
};

module.exports = wishlistController;