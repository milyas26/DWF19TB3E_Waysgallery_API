'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Transactions_Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Transactions_Users.init(
    {
      hiredId: DataTypes.INTEGER,
      orderById: DataTypes.INTEGER,
      orderToId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Transactions_Users',
    },
  )
  return Transactions_Users
}
