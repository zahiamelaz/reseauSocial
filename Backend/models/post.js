'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.post.belongsTo(models.user, {
        foreignKey: 'userId',
        as: 'users',
        onDelete: 'CASCADE',
      });

      models.post.hasMany(models.comment, {
          foreignKey: 'postId',
          as: 'comments',
          onDelete: 'CASCADE',});

      models.post.hasMany(models.like, {
        foreignKey: 'postId',
        as: 'likes',
        onDelete: 'CASCADE',});
    }
  }
  post.init({
    userId: DataTypes.INTEGER,
    content: DataTypes.STRING,
    attachement: DataTypes.STRING,
    likesCount: DataTypes.INTEGER,
    dislikesCount: DataTypes.INTEGER,
    commentairesCount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'post',
  });
  return post;
};