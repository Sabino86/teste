const Sequelize = require('sequelize')
const configs = require('../config/database')

const connection = new Sequelize(configs)

module.exports = connection
