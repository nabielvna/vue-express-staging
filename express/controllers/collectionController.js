const { Collection, Product, ProductAsset, ProductSize, Size, sequelize } = require('../models');
const { Op } = require('sequelize');

const collectionController = {
    // Helper method to generate path
    generatePath(name) {
        return name
            .toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with hyphens
            .replace(/[^a-z0-9-]/g, '')     // Remove special characters
            .replace(/-+/g, '-');           // Replace multiple hyphens with single hyphen
    },

    async getAllCollections(req, res) {
        try {
            // First, get all collections
            const collections = await Collection.findAll({
                attributes: {
                    include: [
                        [
                            sequelize.literal(`(
                                SELECT COUNT(*)
                                FROM Products
                                WHERE Products.collection_id = Collection.id
                            )`),
                            'total_products'
                        ]
                    ]
                },
                include: [{
                    model: Product,
                    separate: true, // This is important for applying limit correctly
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
                data: collections
            });
        } catch (error) {
            console.error('Error in getAllCollections:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async getCollectionsSummary(req, res) {
        try {
            const collections = await Collection.findAll({  
                order: [['created_at', 'DESC']]
            });

            return res.status(200).json({
                status: 'success',
                data: collections
            });
        } catch (error) {
            console.error('Error in getAllCollections:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async getCollectionById(req, res) {
        try {
            const { id } = req.params;
            
            const collection = await Collection.findByPk(id, {
                include: [{
                    model: Product,
                    attributes: ['id', 'name', 'price', 'description'],
                    include: [{
                        model: ProductAsset,
                        attributes: ['asset', 'asset_url'] // menambahkan asset dan asset_url
                    }]
                }]
            });

            if (!collection) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Collection not found'
                });
            }

            return res.status(200).json({
                status: 'success',
                data: collection
            });
        } catch (error) {
            console.error('Error in getCollectionById:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async getCollectionByPath(req, res) {
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
    
            // First, get the collection details
            const collection = await Collection.findOne({
                where: { path },
                attributes: ['id', 'name', 'path', 'createdAt', 'updatedAt']
            });
    
            if (!collection) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Collection not found'
                });
            }
    
            // Then, get the products with pagination
            const productsData = await Product.findAndCountAll({
                where: {
                    ...whereProduct,
                    collection_id: collection.id // Filter berdasarkan collection_id
                },
                include: [
                    {
                        model: ProductAsset,
                        attributes: ['asset', 'asset_url']
                    },
                    {
                        model: Size,
                        through: {
                            model: ProductSize,
                            attributes: ['stock']
                        },
                        attributes: ['id', 'size']
                    }
                ],
                order: [[validSortBy, validSortOrder]],
                limit: parseInt(limit),
                offset: offset,
                distinct: true
            });
    
            return res.status(200).json({
                status: 'success',
                data: {
                    ...collection.toJSON(),
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
            console.error('Error in getCollectionByPath:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async createCollection(req, res) {
        try {
            const { name, path: customPath } = req.body;

            if (!name) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Collection name is required'
                });
            }

            const path = customPath || collectionController.generatePath(name);

            // Check if collection with same name or path exists
            const existingCollection = await Collection.findOne({
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

            if (existingCollection) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Collection with this name or path already exists'
                });
            }

            const collection = await Collection.create({ 
                name,
                path
            });

            return res.status(201).json({
                status: 'success',
                message: 'Collection created successfully',
                data: collection
            });
        } catch (error) {
            console.error('Error in createCollection:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async updateCollection(req, res) {
        try {
            const { id } = req.params;
            const { name, path: customPath } = req.body;

            if (!name) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Collection name is required'
                });
            }

            const collection = await Collection.findByPk(id);

            if (!collection) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Collection not found'
                });
            }

            const path = customPath || collectionController.generatePath(name);

            // Check if another collection with same name or path exists
            const existingCollection = await Collection.findOne({
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

            if (existingCollection) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Collection with this name or path already exists'
                });
            }

            await collection.update({ 
                name,
                path
            });

            return res.status(200).json({
                status: 'success',
                message: 'Collection updated successfully',
                data: collection
            });
        } catch (error) {
            console.error('Error in updateCollection:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async deleteCollection(req, res) {
        try {
            const { id } = req.params;

            const collection = await Collection.findByPk(id);

            if (!collection) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Collection not found'
                });
            }

            // Check if collection has associated products
            const productsCount = await Product.count({
                where: { collection_id: id }
            });

            if (productsCount > 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Cannot delete collection with associated products'
                });
            }

            await collection.destroy();

            return res.status(200).json({
                status: 'success',
                message: 'Collection deleted successfully'
            });
        } catch (error) {
            console.error('Error in deleteCollection:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
};

module.exports = collectionController;