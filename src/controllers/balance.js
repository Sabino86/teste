const service = require('../services/balance')

const find = async ({ client, query }, res) => {
  const { success, balance } = await service.getBalance(client.id, query)

  if (!success) {
    return res.sendStatus(500)
  }

  return res.status(200).send(balance)
}

const update = async ({ query }, res) => {
  const executor = query.query
  const { success, balance } = await service.updateBalance(executor)

  if (!success) {
    return res.sendStatus(500)
  }

  return res.status(200).send(balance)
}

module.exports = {
  find, update
}
