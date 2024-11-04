const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.STRING(40),
      primaryKey: true
    },
    score: DataTypes.INTEGER,
    comment: DataTypes.STRING(500),
    order_item_id: {
      type: DataTypes.STRING(40),
      allowNull: false,
      references: {
        model: 'order_item',
        key: 'id'
      }
    },
  }, {
    timestamps: true,
    underscored: true
  });

  Review.associate = (models) => {
    Review.belongsTo(models.OrderItem);
    Review.belongsTo(models.Product);
    Review.hasMany(models.ReviewAsset);
  };

  return Review;
};