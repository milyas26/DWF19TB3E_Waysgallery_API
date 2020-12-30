'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Project.hasMany(models.Image, {
        as: 'photos',
      })

      Project.belongsTo(models.Hire, {
        as: 'hire',
      })
    }
  }
  Project.init(
    {
      description: DataTypes.TEXT,
      hireId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Project',
    },
  )
  return Project
}
