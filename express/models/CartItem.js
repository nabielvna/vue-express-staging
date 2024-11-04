// models/CartItem.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CartItem = sequelize.define('CartItem', {
    id: {
      type: DataTypes.STRING(40),
      primaryKey: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    cart_id: {
      type: DataTypes.STRING(40),
      allowNull: false,
      references: {
        model: 'carts',
        key: 'id'
      }
    },
    product_size_id: {
      type: DataTypes.STRING(40),
      allowNull: false,
      references: {
        model: 'product_sizes',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'cart_items',
    defaultScope: {
      attributes: ['id', 'quantity', 'cart_id', 'product_size_id']
    }
  });

  CartItem.associate = (models) => {
    CartItem.belongsTo(models.Cart, {
      foreignKey: 'cart_id'
    });
    CartItem.belongsTo(models.ProductSize, {
      foreignKey: 'product_size_id',
      as: 'ProductSize'
    });
  };

  return CartItem;
};