const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProductAsset = sequelize.define('ProductAsset', {
    id: {
      type: DataTypes.STRING(40),
      primaryKey: true
    },
    product_id: {
      type: DataTypes.STRING(40),
      allowNull: false,
      references: {
        model: 'products',
        key: 'id'
      }
    },
    asset: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    asset_url: {
      type: DataTypes.VIRTUAL,
      get() {
        return `assets/products/${this.asset}`;
      }
    }
  }, {
    timestamps: true,
    underscored: true
  });

  ProductAsset.associate = (models) => {
    ProductAsset.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product'
    });
  };

  return ProductAsset;
};