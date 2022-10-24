'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
          //  models.user.belongsToMany(models.post, {
          //   through: models.comment,
          //   foreignKey: 'userId',
          //   otherKey: 'postId',
          // });
          // models.post.belongsToMany(models.user, {
          //     through: models.comment,
          //     foreignKey: 'postId',
          //     otherKey: 'userId',
          // });
      models.comment.belongsTo(models.user, {
        foreignKey: 'userId',
        as:'users'
      })
      models.comment.belongsTo(models.post, {
        foreignKey: 'postId',
        as:'posts'
      })
    }
  }
  comment.init({
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'comment',
  });
  return comment;
};