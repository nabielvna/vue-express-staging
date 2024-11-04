const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Size = sequelize.define('Size', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    size: DataTypes.STRING(10)
  }, {
    timestamps: true,
    underscored: true
  });

  Size.associate = (models) => {
    Size.belongsToMany(models.Product, { through: models.ProductSize });
  };

  return Size;
};