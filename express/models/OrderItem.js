const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OrderItem = sequelize.define('OrderItem', {
    id: {
      type: DataTypes.STRING(40),
      primaryKey: true
    },
    order_id: {
      type: DataTypes.STRING(40),
      allowNull: false,
      references: {
        model: 'orders',
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
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'order_items',
    defaultScope: {
      attributes: ['id', 'order_id', 'product_size_id', 'quantity']
    }
  });

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, {
      foreignKey: 'order_id',
      onDelete: 'CASCADE'
    });
    OrderItem.belongsTo(models.ProductSize, {
      foreignKey: 'product_size_id',
      as: 'ProductSize'
    });
  };

  return OrderItem;
};