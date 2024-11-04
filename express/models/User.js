const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.STRING(40),
      primaryKey: true
    },
    email: DataTypes.STRING(100),
    nickname: {
      type: DataTypes.STRING(50),
      allowNull: true
    }, 
    name: DataTypes.STRING(100),
    password: DataTypes.STRING(200),
    profile_picture: {
      type: DataTypes.STRING(300),
      allowNull: true
    }, 
    profile_picture_url: {
      type: DataTypes.VIRTUAL,
      get() {
        if (!this.profile_picture) return null;
        return `assets/profiles/${this.profile_picture}`; 
      }
    },
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: true
    }, 
    accept_policy: DataTypes.BOOLEAN,
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      references: {
        model: 'roles',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    underscored: true
  });

  User.associate = (models) => {
    User.hasMany(models.Address);
    User.belongsTo(models.Role);
    User.hasOne(models.Cart);
    User.hasOne(models.Wishlist);
    User.hasMany(models.Order);
  };

  return User;
};