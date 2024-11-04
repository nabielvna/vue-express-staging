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
    quantity: DataTypes.INTEGER
  }, {
    timestamps: true,
    underscored: true
  });

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order);
    // Ubah ini dari Product ke ProductSize
    OrderItem.belongsTo(models.ProductSize, {
      foreignKey: 'product_size_id',
      as: 'ProductSize'  // Tambahkan alias
    });
  };

  return OrderItem;
};