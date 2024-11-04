const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ReviewAsset = sequelize.define('ReviewAsset', {
    id: {
      type: DataTypes.STRING(40),
      primaryKey: true
    },
    asset: DataTypes.STRING(300),
    review_id: {
      type: DataTypes.STRING(40),
      allowNull: false,
      references: {
        model: 'review',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    underscored: true
  });

  ReviewAsset.associate = (models) => {
    ReviewAsset.belongsTo(models.Review);
  };

  return ReviewAsset;
};