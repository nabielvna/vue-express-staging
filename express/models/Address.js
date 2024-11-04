const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Address = sequelize.define('Address', {
    id: {
      type: DataTypes.STRING(40),
      primaryKey: true
    },
    name: DataTypes.STRING(50), 
    street_address: DataTypes.STRING(300),
    subdistrict: DataTypes.STRING(100),
    city: DataTypes.STRING(100),
    district: DataTypes.STRING(100),
    postal_code: DataTypes.STRING(15),
    province: DataTypes.STRING(100),
    country: DataTypes.STRING(100),
    user_id: {
      type: DataTypes.STRING(40),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    underscored: true
  });

  Address.associate = (models) => {
    Address.belongsTo(models.User);
  };

  return Address;
};