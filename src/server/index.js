const express = require('express')
const bodyParser = require('body-parser')
const { apiVersion } = require('../config/app')
const authMiddleware = require('../middlewares/auth')
const balanceController = require('../controllers/balance')
const transactionController = require('../controllers/transaction')

const app = express()

/**
 * Middleware
 */

// Cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type')

  next()
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

/**
 * Routes
 */
const routes = express.Router()

// GET /api/v1/balance?clientId= - Obtém saldo para transacoes com a clientId
routes.get('/balance', authMiddleware, balanceController.find)
routes.put('/balance', authMiddleware, balanceController.update)

routes.post('/transactions', transactionController.create)
routes.get('/transactions',authMiddleware, transactionController.findAll)
routes.get('/transactions/:id',authMiddleware, transactionController.find)

routes.all('*', (req, res) => {
  console.error('Rota inválida')
  res.sendStatus(400)
})

// Prefix routes with api version
app.use(apiVersion, routes)

module.exports = app
