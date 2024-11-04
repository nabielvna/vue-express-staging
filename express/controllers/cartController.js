// cartController.js
const { Cart, CartItem, ProductSize, Product, ProductAsset, Size } = require('../models');
const { v4: uuidv4 } = require('uuid');

const cartController = {
  // Get user's cart with items
  async getCart(req, res) {
    try {
      const userId = req.user.id;

      let cart = await Cart.findOne({
        where: { user_id: userId },
        include: [{
          model: CartItem,
          include: [{
            model: ProductSize,
            as: 'ProductSize', // Tambahkan alias sesuai yang didefinisikan di model
            include: [{
              model: Product,
              include: [ProductAsset]
            }, {
              model: Size
            }]
          }]
        }]
      });

      // Create cart if it doesn't exist
      if (!cart) {
        cart = await Cart.create({
          id: uuidv4(),
          user_id: userId,
          total_price: 0,
          total_item: 0
        });
      }

      res.json({
        status: 'success',
        data: cart
      });
    } catch (error) {
      console.error('Get Cart Error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error retrieving cart'
      });
    }
  },

  // Add item to cart
  async addItem(req, res) {
    try {
      const userId = req.user.id;
      const { product_size_id, quantity = 1 } = req.body;

      // Validate input
      if (!product_size_id) {
        return res.status(400).json({
          status: 'error',
          message: 'Product size ID is required'
        });
      }

      // Check product size exists and has stock
      const productSize = await ProductSize.findOne({
        where: { id: product_size_id },
        include: [{
          model: Product,
          attributes: ['id', 'name', 'price']
        }]
      });

      if (!productSize) {
        return res.status(404).json({
          status: 'error',
          message: 'Product size not found'
        });
      }

      if (productSize.stock < quantity) {
        return res.status(400).json({
          status: 'error',
          message: 'Insufficient stock'
        });
      }

      // Get or create cart
      let cart = await Cart.findOne({ 
        where: { user_id: userId },
        attributes: ['id', 'total_price', 'total_item', 'user_id']
      });
      
      if (!cart) {
        cart = await Cart.create({
          id: uuidv4(),
          user_id: userId,
          total_price: 0,
          total_item: 0
        });
      }

      // Check if item already exists in cart - simplified query
      let cartItem = await CartItem.findOne({
        where: {
          cart_id: cart.id,
          product_size_id
        },
        attributes: ['id', 'quantity', 'cart_id', 'product_size_id']
      });

      if (cartItem) {
        // Update quantity if item exists
        if (productSize.stock < (cartItem.quantity + quantity)) {
          return res.status(400).json({
            status: 'error',
            message: 'Insufficient stock'
          });
        }

        await cartItem.update({
          quantity: cartItem.quantity + quantity
        });
      } else {
        // Create new cart item
        cartItem = await CartItem.create({
          id: uuidv4(),
          cart_id: cart.id,
          product_size_id,
          quantity
        });
      }

      // Update cart totals
      const totalPrice = Number(productSize.Product.price) * quantity;
      await cart.update({
        total_price: cart.total_price + totalPrice,
        total_item: cart.total_item + quantity
      });

      // Get final cart item with associations
      const finalCartItem = await CartItem.findOne({
        where: { id: cartItem.id },
        attributes: ['id', 'quantity', 'cart_id', 'product_size_id'],
        include: [{
          model: ProductSize,
          as: 'ProductSize',
          attributes: ['id', 'stock'],
          include: [{
            model: Product,
            attributes: ['id', 'name', 'price']
          }, {
            model: Size,
            attributes: ['id', 'size']
          }]
        }]
      });

      res.json({
        status: 'success',
        message: 'Item added to cart',
        data: finalCartItem
      });

    } catch (error) {
      console.error('Add to Cart Error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error adding item to cart'
      });
    }
  },

  // Update cart item quantity
  async updateItem(req, res) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const userId = req.user.id;

      if (!quantity || quantity < 1) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid quantity'
        });
      }

      // First, find the cart item with basic info
      const cartItem = await CartItem.findOne({
        where: { id },
        attributes: ['id', 'quantity', 'cart_id', 'product_size_id'],
        include: [{
          model: Cart,
          where: { user_id: userId },
          attributes: ['id', 'total_price', 'total_item']
        }]
      });

      if (!cartItem) {
        return res.status(404).json({
          status: 'error',
          message: 'Cart item not found'
        });
      }

      // Get product size info
      const productSize = await ProductSize.findOne({
        where: { id: cartItem.product_size_id },
        attributes: ['id', 'stock'],
        include: [{
          model: Product,
          attributes: ['id', 'name', 'price']
        }]
      });

      if (!productSize) {
        return res.status(404).json({
          status: 'error',
          message: 'Product size not found'
        });
      }

      if (productSize.stock < quantity) {
        return res.status(400).json({
          status: 'error',
          message: 'Insufficient stock'
        });
      }

      // Calculate differences for cart update
      const priceDiff = (quantity - cartItem.quantity) * Number(productSize.Product.price);
      const quantityDiff = quantity - cartItem.quantity;

      // Update cart item
      await cartItem.update({ quantity });

      // Update cart totals
      await Cart.update({
        total_price: cartItem.Cart.total_price + priceDiff,
        total_item: cartItem.Cart.total_item + quantityDiff
      }, {
        where: { id: cartItem.cart_id }
      });

      // Get updated cart item with all associations
      const updatedCartItem = await CartItem.findOne({
        where: { id },
        attributes: ['id', 'quantity', 'cart_id', 'product_size_id'],
        include: [{
          model: ProductSize,
          as: 'ProductSize',
          attributes: ['id', 'stock'],
          include: [{
            model: Product,
            attributes: ['id', 'name', 'price']
          }, {
            model: Size,
            attributes: ['id', 'size']
          }]
        }]
      });

      res.json({
        status: 'success',
        message: 'Cart item updated',
        data: updatedCartItem
      });
    } catch (error) {
      console.error('Update Cart Item Error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error updating cart item'
      });
    }
  },

  // Remove item from cart
  async removeItem(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const cartItem = await CartItem.findOne({
        where: { id },
        include: [{
          model: Cart,
          where: { user_id: userId }
        }, {
          model: ProductSize,
          include: [{
            model: Product,
            attributes: ['price']
          }]
        }]
      });

      if (!cartItem) {
        return res.status(404).json({
          status: 'error',
          message: 'Cart item not found'
        });
      }

      // Calculate price to subtract
      const priceToSubtract = cartItem.quantity * Number(cartItem.ProductSize.Product.price);

      // Update cart totals
      await cartItem.Cart.update({
        total_price: cartItem.Cart.total_price - priceToSubtract,
        total_item: cartItem.Cart.total_item - cartItem.quantity
      });

      // Delete cart item
      await cartItem.destroy();

      res.json({
        status: 'success',
        message: 'Item removed from cart'
      });
    } catch (error) {
      console.error('Remove Cart Item Error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error removing item from cart'
      });
    }
  },

  // Clear cart
  async clearCart(req, res) {
    try {
      const userId = req.user.id;

      const cart = await Cart.findOne({
        where: { user_id: userId }
      });

      if (!cart) {
        return res.status(404).json({
          status: 'error',
          message: 'Cart not found'
        });
      }

      // Delete all cart items
      await CartItem.destroy({
        where: { cart_id: cart.id }
      });

      // Reset cart totals
      await cart.update({
        total_price: 0,
        total_item: 0
      });

      res.json({
        status: 'success',
        message: 'Cart cleared'
      });
    } catch (error) {
      console.error('Clear Cart Error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error clearing cart'
      });
    }
  }
};

module.exports = cartController;