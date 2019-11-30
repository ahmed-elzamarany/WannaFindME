const Sequelize = require('sequelize')
const { postgresURI } = require('./keys')

// Connecting to local postgres
// const sequelize = new Sequelize('notification', 'postgres', '123456789', {
//   host: 'localhost',
//   dialect: 'postgres'
// })

// Connecting to remote postgres
const sequelize = new Sequelize(postgresURI)

module.exports = sequelize
