'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Post, {
        as: 'posts',
      })

      User.hasMany(models.Art, {
        as: 'arts',
      })

      User.belongsToMany(models.Hire, {
        through: 'Transactions_Users',
        foreignKey: 'orderToId',
        as: 'orderTo',
      })

      User.belongsToMany(models.Hire, {
        through: 'Transactions_Users',
        foreignKey: 'orderById',
        as: 'orderBy',
      })

      // FOLLOW
      User.belongsToMany(models.User, {
        foreignKey: 'followingId',
        otherKey: 'followerId',
        as: 'following',
        through: 'Follows',
      })

      User.belongsToMany(models.User, {
        foreignKey: 'followerId',
        otherKey: 'followingId',
        as: 'follower',
        through: 'Follows',
      })
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      fullName: DataTypes.STRING,
      greeting: DataTypes.STRING,
      avatar: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
    },
  )
  return User
}
