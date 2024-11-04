const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const WishlistItem = sequelize.define('WishlistItem', {
    wishlist_id: {
      type: DataTypes.STRING(40),
      primaryKey: true,
      references: {
        model: 'wishlists',
        key: 'id'
      }
    },
    product_id: {
      type: DataTypes.STRING(40),
      primaryKey: true,
      references: {
        model: 'products',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'wishlist_items'
  });

  return WishlistItem;
};