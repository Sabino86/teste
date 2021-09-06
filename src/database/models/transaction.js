const Sequelize = require('sequelize')
const connection = require('../index')

const Transaction = connection.define('transaction', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  client_id: {
    allowNull: false,
    type: Sequelize.INTEGER,
  },
  amount: {
    allowNull: false,
    type: Sequelize.DOUBLE,
  },
  card_holder_name: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  card_expiration_date: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  card_last_digits: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  card_cvv: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  card_brand: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  payment_method: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  description: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  createdAt: {
    field: 'created_at',
    type: Sequelize.DATE,
  },
  updatedAt: {
    field: 'updated_at',
    type: Sequelize.DATE,
  },
})

module.exports = Transaction
