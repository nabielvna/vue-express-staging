const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OrderStatus = sequelize.define('OrderStatus', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING(50)
  }, {
    timestamps: true,
    underscored: true
  });

  OrderStatus.associate = (models) => {
    OrderStatus.hasMany(models.Order);
  };

  return OrderStatus;
};