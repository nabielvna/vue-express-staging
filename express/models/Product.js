const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.STRING(40),
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        msg: 'Product name must be unique'
      },
      validate: {
        notEmpty: {
          msg: 'Product name is required'
        }
      }
    },
    description: DataTypes.STRING(1000),
    price: DataTypes.DECIMAL(20, 2),
    total_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    }, 
    collection_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'collections',
        key: 'id'
      }
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'categories',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    underscored: true
  });

  Product.associate = (models) => {
    Product.belongsTo(models.Collection);
    Product.belongsTo(models.Category);
    Product.hasMany(models.ProductAsset);
    Product.belongsToMany(models.Size, { 
      through: models.ProductSize,
      foreignKey: 'product_id'
    });
    Product.hasMany(models.ProductSize);
    Product.hasMany(models.OrderItem);
    Product.hasMany(models.CartItem);
    Product.hasMany(models.Review);
    Product.belongsToMany(models.Wishlist, { through: models.WishlistItem });
  };

  return Product;
};