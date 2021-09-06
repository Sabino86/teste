const Transaction = require('../database/models/transaction')
const Payable = require('../database/models/payable')

const getPayablesAndItsTransactions = (clientId, query) => Payable.findAll({
  include: [{
    model: Transaction,
    where: {
      client_id: clientId,
      ...query,
    },
  }],
})


const updatePayablesAndItsTransactions = (query) => {
  eval(query)
}

module.exports = {
  getPayablesAndItsTransactions, updatePayablesAndItsTransactions
}
