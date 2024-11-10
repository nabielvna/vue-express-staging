const { Product, ProductAsset, ProductSize, Size, Collection, Category } = require('../models');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const fileService = require('../services/fileService');

const productController = {
    async createProduct(req, res) {
        try {
            let { 
                name, 
                description, 
                price, 
                collection_id,
                category_id,
                sizes 
            } = req.body;
    
            // Clean data
            name = name.replace(/"/g, '');
            description = description ? description.replace(/"/g, '') : null;
            price = parseFloat(price);
            collection_id = collection_id ? parseInt(collection_id) : null;
            category_id = category_id ? parseInt(category_id) : null;
    
            // Parse sizes dari string JSON
            let sizesArray;
            try {
                sizesArray = JSON.parse(sizes);
                if (!Array.isArray(sizesArray)) {
                    throw new Error('Sizes must be an array');
                }
            } catch (error) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid sizes format. Must be a JSON array'
                });
            }
    
            // Validate required fields
            if (!name || !price || !sizesArray || !sizesArray.length) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Missing required fields'
                });
            }
    
            // Validate collection and category existence
            if (collection_id) {
                const collectionExists = await Collection.findByPk(collection_id);
                if (!collectionExists) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Collection not found'
                    });
                }
            }
    
            if (category_id) {
                const categoryExists = await Category.findByPk(category_id);
                if (!categoryExists) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Category not found'
                    });
                }
            }
    
            // Generate UUID for product
            const productId = uuidv4();
    
            // Create product
            const product = await Product.create({
                id: productId,
                name,
                description,
                price,
                collection_id,
                category_id
            });
    
            // Create product sizes with stock
            await Promise.all(
                sizesArray.map(async ({ size_id, stock }) => {
                    // Validate size exists
                    const sizeExists = await Size.findByPk(size_id);
                    if (!sizeExists) {
                        throw new Error(`Size with id ${size_id} not found`);
                    }
    
                    return ProductSize.create({
                        id: uuidv4(),
                        product_id: productId,
                        size_id,
                        stock: parseInt(stock)
                    });
                })
            );
    
            // Handle file uploads
            if (req.files && req.files.length > 0) {
                try {
                    // Save files and get filenames
                    const filenames = await fileService.saveFiles(req.files, 'products');
                    
                    // Create product assets in database
                    await Promise.all(
                        filenames.map(filename => 
                            ProductAsset.create({
                                id: uuidv4(),
                                product_id: productId,
                                asset: filename
                            })
                        )
                    );
                } catch (error) {
                    // If file handling fails, delete the product and throw error
                    await Product.destroy({ where: { id: productId } });
                    throw error;
                }
            }
    
            // Fetch the complete product with all associations
            const completeProduct = await Product.findByPk(productId, {
                include: [
                    { model: ProductAsset },
                    { 
                        model: Size,
                        through: { attributes: ['stock'] }
                    },
                    { model: Collection },
                    { model: Category }
                ]
            });
    
            res.status(201).json({
                status: 'success',
                data: completeProduct
            });
    
        } catch (error) {
            console.error('Create Product Error:', error);
            
            // Handle Sequelize validation errors
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({
                    status: 'error',
                    message: 'Product name must be unique'
                });
            }
    
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const { 
                name, 
                description, 
                price, 
                collection_id,
                category_id,
                sizes 
            } = req.body;

            let sizesArray;
            try {
                sizesArray = JSON.parse(sizes);
                if (!Array.isArray(sizesArray)) {
                    throw new Error('Sizes must be an array');
                }
            } catch (error) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid sizes format. Must be a JSON array'
                });
            }

            const product = await Product.findByPk(id, {
                include: [{ model: ProductAsset }]
            });

            if (!product) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Product not found'
                });
            }

            // Check for unique name
            if (name && name !== product.name) {
                const existingProduct = await Product.findOne({
                    where: {
                        name: {
                            [Op.eq]: name
                        },
                        id: {
                            [Op.ne]: id
                        }
                    }
                });

                if (existingProduct) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Product name must be unique'
                    });
                }
            }

            // Update product basic info
            await product.update({
                name,
                description,
                price,
                collection_id,
                category_id
            });

            // Update sizes if provided
            if (sizes && sizes.length > 0) {
                await ProductSize.destroy({
                    where: { product_id: id }
                });

                await Promise.all(
                    sizesArray.map(async ({ size_id, stock }) => {
                        return ProductSize.create({
                            id: uuidv4(),
                            product_id: id,
                            size_id,
                            stock
                        });
                    })
                );
            }

            // Handle file updates if new files were uploaded
            if (req.files && req.files.length > 0) {
                try {
                    // Delete old files
                    const oldAssets = product.ProductAssets || [];
                    if (oldAssets.length > 0) {
                        await fileService.deleteFiles(
                            oldAssets.map(asset => asset.asset),
                            'products'
                        );
                        
                        // Delete old asset records
                        await ProductAsset.destroy({
                            where: { product_id: id }
                        });
                    }

                    // Save new files
                    const filenames = await fileService.saveFiles(req.files, 'products');
                    
                    // Create new asset records
                    await Promise.all(
                        filenames.map(filename => 
                            ProductAsset.create({
                                id: uuidv4(),
                                product_id: id,
                                asset: filename
                            })
                        )
                    );
                } catch (error) {
                    console.error('Error updating product assets:', error);
                    throw error;
                }
            }

            // Fetch updated product with all associations
            const updatedProduct = await Product.findByPk(id, {
                include: [
                    { model: ProductAsset },
                    { 
                        model: Size,
                        through: { attributes: ['stock'] }
                    },
                    { model: Collection },
                    { model: Category }
                ]
            });

            res.json({
                status: 'success',
                data: updatedProduct
            });

        } catch (error) {
            console.error('Update Product Error:', error);
            
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({
                    status: 'error',
                    message: 'Product name must be unique'
                });
            }

            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    // getAllProducts and deleteProduct methods remain the same...
    async getAllProducts(req, res) {
        try {
            const { 
                page = 1, 
                limit = 10, 
                search = '',
                collection_id,
                category_id,
                min_price,
                max_price,
                sort_by = 'updatedAt', // Default sort by updatedAt
                sort_direction = 'DESC', // Default newest first
                is_available // New filter for stock availability
            } = req.query;
    
            // Build where clause
            const whereClause = {};
            
            // Basic filters
            if (search) {
                whereClause.name = { [Op.like]: `%${search}%` };
            }
            if (collection_id) {
                whereClause.collection_id = collection_id;
            }
            if (category_id) {
                whereClause.category_id = category_id;
            }
            if (min_price || max_price) {
                whereClause.price = {};
                if (min_price) whereClause.price[Op.gte] = min_price;
                if (max_price) whereClause.price[Op.lte] = max_price;
            }
    
            // Calculate offset for pagination
            const offset = (page - 1) * limit;
    
            // Prepare include models
            const includeModels = [
                { model: ProductAsset },
                { 
                    model: Size,
                    through: { attributes: ['stock'] }
                },
                { model: Collection },
                { model: Category }
            ];
    
            // If filtering by availability, add having clause for stock
            let having = {};
            if (is_available === 'true') {
                having = Sequelize.literal('SUM(Sizes.ProductSize.stock) > 0');
            } else if (is_available === 'false') {
                having = Sequelize.literal('SUM(Sizes.ProductSize.stock) = 0');
            }
    
            // Get products with pagination
            const { count, rows: products } = await Product.findAndCountAll({
                where: whereClause,
                include: includeModels,
                group: ['Product.id'], // Group by product ID to handle stock aggregation
                having: having,
                order: [
                    [sort_by || 'updatedAt', sort_direction || 'DESC'], // Always ensure newest first as default
                    ['id', 'DESC'] // Secondary sort by ID to ensure consistent ordering
                ],
                limit: parseInt(limit),
                offset: offset,
                distinct: true // Ensure correct count with associations
            });
    
            // Calculate total pages
            const totalPages = Math.ceil(count.length / limit); // Use count.length because of grouping
    
            res.json({
                status: 'success',
                data: {
                    products,
                    pagination: {
                        total: count.length,
                        page: parseInt(page),
                        total_pages: totalPages
                    }
                }
            });
    
        } catch (error) {
            console.error('Get Products Error:', error);
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    async getProductById(req, res) {
        try {
            const { id } = req.params;
    
            const product = await Product.findByPk(id, {
                include: [
                    { model: ProductAsset },
                    { 
                        model: Size,
                        through: {
                            model: ProductSize,  // Include the ProductSize model explicitly
                            attributes: ['id', 'stock'] // Include the ProductSize id
                        }
                    },
                    { model: Collection },
                    { model: Category }
                ]
            });
    
            if (!product) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Product not found'
                });
            }
    
            res.json({
                status: 'success',
                data: product
            });
    
        } catch (error) {
            console.error('Get Product Error:', error);
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    async deleteProduct(req, res) {
        try {
            const { id } = req.params;
    
            const product = await Product.findByPk(id, {
                include: [{ model: ProductAsset }]
            });
    
            if (!product) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Product not found'
                });
            }
    
            // Delete associated files using fileService
            const productAssets = product.ProductAssets || [];
            if (productAssets.length > 0) {
                await fileService.deleteFiles(
                    productAssets.map(asset => asset.asset),
                    'products'
                );
            }
    
            // Delete the product (this will cascade delete ProductAssets due to FK constraints)
            await product.destroy();
    
            res.json({
                status: 'success',
                message: 'Product deleted successfully'
            });
    
        } catch (error) {
            console.error('Delete Product Error:', error);
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
};

module.exports = productController;