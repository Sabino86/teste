const R = require('ramda')
const Model = require('../database/models/transaction')
const Payable = require('../database/models/payable')
const connection = require('../database')

const insertTransactionIdIntoPayable = (payable, id) => R.assoc(
  'transaction_id',
  id,
  payable
)

const findAll = () => Model.findAll()

const create = async (transactionObject, payableObject) => {
  const transactionCreated = await connection
    .transaction(async () => {
      const created = await Model
        .create(transactionObject)

      const payableWithTransactionId = insertTransactionIdIntoPayable(
        payableObject,
        R.prop('id')(created)
      )

      await Payable
        .create(payableWithTransactionId)

      return created
    })

  return transactionCreated
}

const find = id => Model.findByPk(id)

module.exports = {
  findAll,
  create,
  find,
}
