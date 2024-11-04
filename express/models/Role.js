const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING(15)
  }, {
    timestamps: true,
    underscored: true
  });

  Role.associate = (models) => {
    Role.hasMany(models.User);
  };

  return Role;
};