const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Wishlist = sequelize.define('Wishlist', {
    id: {
      type: DataTypes.STRING(40),
      primaryKey: true
    }, 
    user_id: {
      type: DataTypes.STRING(40),
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    underscored: true
  });

  Wishlist.associate = (models) => {
    Wishlist.belongsTo(models.User);
    Wishlist.belongsToMany(models.Product, { through: models.WishlistItem });
  };

  return Wishlist;
};