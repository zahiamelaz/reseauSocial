'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.user.hasMany(models.post , { foreignKey: "userId",
        as: "posts",
        onDelete: "CASCADE",});

      models.user.hasMany(models.comment , {foreignKey: "userId",
        as: "comments",
        onDelete: "CASCADE",});

      models.user.hasMany(models.like, {foreignKey: "userId",
        as: "likes",
        onDelete: "CASCADE",});
    }
  }
  user.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    attachement: DataTypes.STRING,
    bio: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};