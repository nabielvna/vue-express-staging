const { Category, Product, ProductAsset, sequelize } = require('../models');
const { Op } = require('sequelize');

const categoryController = {
    // Helper method to generate path
    generatePath(name) {
        return name
            .toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with hyphens
            .replace(/[^a-z0-9-]/g, '')     // Remove special characters
            .replace(/-+/g, '-');           // Replace multiple hyphens with single hyphen
    },

    // Get all categories
    async getAllCategories(req, res) {
        try {
            // Get all categories with product count and limited products
            const categories = await Category.findAll({
                attributes: {
                    include: [
                        [
                            sequelize.literal(`(
                                SELECT COUNT(*)
                                FROM Products
                                WHERE Products.category_id = Category.id
                            )`),
                            'total_products'
                        ]
                    ]
                },
                include: [{
                    model: Product,
                    separate: true, // Enables correct limit functionality
                    attributes: ['id', 'name', 'price', 'description'],
                    include: [{
                        model: ProductAsset,
                        attributes: ['asset', 'asset_url']
                    }],
                    limit: 3,
                    order: [['created_at', 'DESC']]
                }],
                order: [['created_at', 'DESC']]
            });
    
            return res.status(200).json({
                status: 'success',
                data: categories
            });
        } catch (error) {
            console.error('Error in getAllCategories:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async getCategoriesSummary(req, res) {
        try {
            const categories = await Category.findAll({
                order: [['created_at', 'DESC']]
            });

            return res.status(200).json({
                status: 'success',
                data: categories
            });
        } catch (error) {
            console.error('Error in getAllCategories:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    // Get category by ID
    async getCategoryById(req, res) {
        try {
            const { id } = req.params;
            
            const category = await Category.findByPk(id, {
                include: [{
                    model: Product,
                    attributes: ['id', 'name', 'price', 'description'],
                    include: [{
                        model: ProductAsset,
                        attributes: ['asset', 'asset_url'] // menambahkan asset dan asset_url
                    }]
                }],
            });
            
            if (!category) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Category not found'
                });
            }

            return res.status(200).json({
                status: 'success',
                data: category
            });
        } catch (error) {
            console.error('Error in getCategoryById:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    // Get category by path
    async getCategoryByPath(req, res) {
        try {
            const { path } = req.params;
            const { 
                minPrice, 
                maxPrice, 
                sortBy = 'createdAt', 
                sortOrder = 'DESC',
                search,
                page = 1,
                limit = 6
            } = req.query;
    
            // Build filter conditions
            const whereProduct = {};
            
            // Price range filter
            if (minPrice || maxPrice) {
                whereProduct.price = {};
                if (minPrice) whereProduct.price[Op.gte] = parseFloat(minPrice);
                if (maxPrice) whereProduct.price[Op.lte] = parseFloat(maxPrice);
            }
    
            // Search filter
            if (search) {
                whereProduct[Op.or] = [
                    { name: { [Op.like]: `%${search}%` } },
                    { description: { [Op.like]: `%${search}%` } }
                ];
            }
    
            // Calculate offset for pagination
            const offset = (page - 1) * limit;
    
            // Validate sortBy field
            const allowedSortFields = ['createdAt', 'price', 'name'];
            const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
            
            // Validate sortOrder
            const validSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) 
                ? sortOrder.toUpperCase() 
                : 'DESC';
    
            // First, get the category details
            const category = await Category.findOne({
                where: { path },
                attributes: ['id', 'name', 'path', 'createdAt', 'updatedAt']
            });
    
            if (!category) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Category not found'
                });
            }
    
            // Then, get the products with pagination
            const productsData = await Product.findAndCountAll({
                where: whereProduct,
                include: [
                    {
                        model: Category,
                        where: { path },
                        attributes: []  // Don't include category data in result
                    },
                    {
                        model: ProductAsset,
                        attributes: ['asset', 'asset_url']
                    }
                ],
                order: [[validSortBy, validSortOrder]],
                limit: parseInt(limit),
                offset: offset,
                distinct: true // Important for correct count with associations
            });
    
            return res.status(200).json({
                status: 'success',
                data: {
                    ...category.toJSON(),
                    Products: productsData.rows,
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages: Math.ceil(productsData.count / limit),
                        totalItems: productsData.count,
                        itemsPerPage: parseInt(limit)
                    }
                }
            });
        } catch (error) {
            console.error('Error in getCategoryByPath:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    // Create new category
    async createCategory(req, res) {
        try {
            const { name, path: customPath } = req.body;

            if (!name) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Category name is required'
                });
            }

            const path = customPath || categoryController.generatePath(name);

            // Check if category with same name or path exists
            const existingCategory = await Category.findOne({
                where: {
                    [Op.or]: [
                        { 
                            name: {
                                [Op.like]: name
                            }
                        },
                        { path }
                    ]
                }
            });

            if (existingCategory) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Category with this name or path already exists'
                });
            }

            const category = await Category.create({
                name,
                path
            });

            return res.status(201).json({
                status: 'success',
                message: 'Category created successfully',
                data: category
            });
        } catch (error) {
            console.error('Error in createCategory:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    // Update category
    async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const { name, path: customPath } = req.body;

            if (!name) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Category name is required'
                });
            }

            const category = await Category.findByPk(id);

            if (!category) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Category not found'
                });
            }

            const path = customPath || categoryController.generatePath(name);

            // Check if another category with same name or path exists
            const existingCategory = await Category.findOne({
                where: {
                    [Op.or]: [
                        { 
                            name: {
                                [Op.like]: name
                            }
                        },
                        { path }
                    ],
                    id: { [Op.ne]: id }
                }
            });

            if (existingCategory) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Category with this name or path already exists'
                });
            }

            await category.update({
                name,
                path
            });

            return res.status(200).json({
                status: 'success',
                message: 'Category updated successfully',
                data: category
            });
        } catch (error) {
            console.error('Error in updateCategory:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    // Delete category
    async deleteCategory(req, res) {
        try {
            const { id } = req.params;

            const category = await Category.findByPk(id);

            if (!category) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Category not found'
                });
            }

            // Check if category has associated products
            const productsCount = await Product.count({
                where: { category_id: id }
            });

            if (productsCount > 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Cannot delete category with associated products'
                });
            }

            await category.destroy();

            return res.status(200).json({
                status: 'success',
                message: 'Category deleted successfully'
            });
        } catch (error) {
            console.error('Error in deleteCategory:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
};

module.exports = categoryController;