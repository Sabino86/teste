const R = require('ramda')
const { query } = require('../database')
const repository = require('../repositories/balance')

const getStatus = obj => R.prop('status')(obj)

const isPaid = obj => getStatus(obj) === 'paid'

const isWaitingFunds = obj => getStatus(obj) === 'waiting_funds'

const filterObject = (filter, obj) => R.filter(filter)(obj)

const calculateAmountToPay = (obj) => {
  const amount = R.path(['transaction', 'amount'])(obj)
  const fee = R.prop('fee')(obj)
  return R.subtract(amount, fee)
}

const getPayAmount = arrayOfPayables => R.pipe(
  R.map(calculateAmountToPay),
  R.reduce(R.add, 0)
)(arrayOfPayables)

const createPayAmountObject = (arrayOfPayables) => {
  const amount = getPayAmount(arrayOfPayables)

  return {
    amount,
  }
}

/**
 * Valor pagavel/pago de cada transacao é a subtracao do valor (amount) menos
 * a taxa (fee).
 */
const calculateBalance = (payablesAndTransactions) => {
  const paidObjects = filterObject(isPaid, payablesAndTransactions)
  const waitingFundsObjects = filterObject(
    isWaitingFunds,
    payablesAndTransactions
  )

  return {
    object: 'balance',
    available: createPayAmountObject(paidObjects),
    waiting_funds: createPayAmountObject(waitingFundsObjects),
  }
}

const getBalance = async (clientId, query) => {
  let success = true; let balance

  try {
    const payablesAndTransactions = await repository
      .getPayablesAndItsTransactions(clientId, query)

    balance = calculateBalance(payablesAndTransactions)
  } catch (error) {
    [success, balance] = [false, {}]
    console.error(error.message)
  }

  return { success, balance }
}

const updateBalance = async (query) => {
  let success = true
  let balance
  try {
    const payablesAndTransactions = await repository
      .updatePayablesAndItsTransactions(query)

    balance = calculateBalance(payablesAndTransactions)
  } catch (error) {
    [success, balance] = [false, {}]
    console.error(error.message)
  }

  return { success, balance }
}

module.exports = {
  getBalance, updateBalance
}
