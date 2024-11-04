const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProductSize = sequelize.define('ProductSize', {
    id: {
      type: DataTypes.STRING(40),
      primaryKey: true
    },
    size_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'sizes',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    product_id: {
      type: DataTypes.STRING(40),
      references: {
        model: 'products',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    }
  }, {
    timestamps: true,
    underscored: true,
    hooks: {
      afterSave: async (productSize, options) => {
        const Product = sequelize.models.Product;
        const totalStock = await ProductSize.sum('stock', {
          where: { product_id: productSize.product_id }
        });
        
        await Product.update(
          { total_stock: totalStock || 0 },
          { 
            where: { id: productSize.product_id },
            transaction: options.transaction 
          }
        );
      },
      afterDestroy: async (productSize, options) => {
        const Product = sequelize.models.Product;
        const totalStock = await ProductSize.sum('stock', {
          where: { product_id: productSize.product_id }
        });
        
        await Product.update(
          { total_stock: totalStock || 0 },
          { 
            where: { id: productSize.product_id },
            transaction: options.transaction 
          }
        );
      }
    }
  });

  ProductSize.associate = (models) => {
    ProductSize.belongsTo(models.Product, {
      foreignKey: 'product_id'
    });
    ProductSize.belongsTo(models.Size, {
      foreignKey: 'size_id'
    });
  };

  return ProductSize;
};