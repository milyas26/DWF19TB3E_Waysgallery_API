'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Hire extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Hire.hasOne(models.Project)

      Hire.belongsToMany(models.User, {
        through: 'Transactions_Users',
        foreignKey: 'hiredId',
        otherKey: 'orderById',
        as: 'orderBy',
      })

      Hire.belongsToMany(models.User, {
        through: 'Transactions_Users',
        foreignKey: 'hiredId',
        otherKey: 'orderToId',
        as: 'orderTo',
      })
    }
  }
  Hire.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      status: DataTypes.STRING,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      price: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Hire',
    },
  )
  return Hire
}
