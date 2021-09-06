/* eslint-disable */
const service = require('../services/transaction')

const findAll = async (req, res) => {
  const transactions = await service.findAll()

  return res.status(200).send(transactions)
}

const create = async ({ body }, res) => {
  const { card_number } = body
  const { isValid, message } = service.isValidRequest(body)

  if (!isValid) {
    return res.status(400).send({ message })
  }

  const {
    isCredCardValid,
    company,
  } = service.creditCardValid(card_number)

  if (!isCredCardValid) {
    return res.status(500).send({
      message: 'Cartão de crédito inválido'
    })
  }

  const { created, transactionCreated } = await service
    .create(body, company)

  if (!created) {
    return res.sendStatus(500)
  }

  return res.status(200).send(transactionCreated)
}

const find = async ({ params }, res) => {
  const { id } = params
  const transaction = await service.find(id)

  return res.status(200).send(transaction)
}

module.exports = {
  findAll,
  create,
  find,
}
