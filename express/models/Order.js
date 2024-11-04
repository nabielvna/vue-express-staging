const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.STRING(40),
      primaryKey: true
    },
    total_price: {
      type: DataTypes.DECIMAL(20, 2),
      defaultValue: 0,
      get() {
        const value = this.getDataValue('total_price');
        return value === null ? 0 : Number(value);
      }
    },
    total_item: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    user_id: {
      type: DataTypes.STRING(40),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    order_status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'order_statuses',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    underscored: true
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User);
    Order.belongsTo(models.OrderStatus);
    Order.hasMany(models.OrderItem);
  };

  return Order;
};