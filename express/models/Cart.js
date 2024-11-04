const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Cart = sequelize.define('Cart', {
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
  }, {
    timestamps: true,
    underscored: true
  });

  Cart.associate = (models) => {
    Cart.belongsTo(models.User);
    Cart.hasMany(models.CartItem);
  };

  return Cart;
};