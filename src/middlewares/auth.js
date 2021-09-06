const connection = require('../database')

module.exports = async (req, res, next) => {
  const { clientId } = req.query

  if (!clientId) {
    const error = new Error('No client ID')
    next(error)
    return
  }

  const query = `SELECT * from "client" where id = ${clientId}`
  const [client] = await connection.query(query, {
    type: 'SELECT',
  })

  if (!client) {
    const error = new Error('No client ID')
    next(error)
    return
  }

  req.client = client
  delete req.query.clientId

  next()
}
