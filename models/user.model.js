const Sequelize = require('sequelize')
const sequelize = require('../config/DBconfig')

const { Model } = Sequelize
class User extends Model { }
User.init(
  {
    userId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    following: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      defaultValue: []
    },
    longitude: {
      type: Sequelize.DOUBLE,
      defaultValue: '0.0'
    },
    latitude: {
      type: Sequelize.DOUBLE,
      defaultValue: '0.0'
    },
  },
  {
    sequelize,
    timestamps: false
  }
)

module.exports = User
