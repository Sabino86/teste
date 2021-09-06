const R = require('ramda')
const Joi = require('@hapi/joi')
const repository = require('../repositories/transaction')
const { validateRequestBasedOnSchema, validateCreditCardNumber } = require('../lib/validation')
const payableService = require('./payable')

const transactionSchema = Joi.object().keys({
  amount: Joi.number(),
  description: Joi.string(),
  payment_method: Joi.string(),
  card_number: Joi.string().creditCard(),
  card_holder_name: Joi.string(),
  card_expiration_date: Joi.string(),
  card_cvv: Joi.string(),
  client_id: Joi.number(),
})

const findAll = async () => {
  const transactions = await repository.findAll()

  return transactions
}

const creditCardCompanyPath = R.path(['card', 'type'])

const getCreditCardCompany = cardObject => creditCardCompanyPath(cardObject)

const parseCreditCardNumber = transaction => R.evolve(
  { card_number: R.takeLast(4) },
  transaction
)

const renameCreditCardKey = (transaction) => {
  const keyRenamed = R.assoc(
    'card_last_digits',
    R.prop('card_number')(transaction),
    transaction
  )

  const oldKeyRemoved = R.omit(['card_number'])(keyRenamed)

  return oldKeyRemoved
}

const addCreditCardCompany = (transaction, company) => R.assoc(
  'card_brand',
  company,
  transaction
)

const createTransactionObjectToInsert = (transaction, company) => {
  const creditCardParsed = parseCreditCardNumber(transaction)

  const creditCardKeyRenamed = renameCreditCardKey(creditCardParsed)

  const finalObject = addCreditCardCompany(creditCardKeyRenamed, company)

  return finalObject
}

const create = async (transaction, creditCardCompany) => {
  let created = true; let transactionCreated

  try {
    const transactionObject = createTransactionObjectToInsert(
      transaction,
      creditCardCompany
    )

    const payableObject = await payableService
      .createPayableObject(transactionObject)

    // Criacao da transacao e do payable
    transactionCreated = await repository
      .create(transactionObject, payableObject)
  } catch (error) {
    [created, transactionCreated] = [false, {}]
    console.error(error.message)
  }

  return { created, transactionCreated }
}

const getErrorMessage = validation => R.pipe(
  R.path(['error', 'details']),
  R.head(),
  R.prop('message')
)(validation)

const getErrorMessageFromValidation = validation => getErrorMessage(validation)

const isValidRequest = (transaction) => {
  const validation = validateRequestBasedOnSchema(
    transaction,
    transactionSchema
  )

  const isValid = !validation.error
  const message = isValid ? null : getErrorMessageFromValidation(validation)

  return { isValid, message }
}

const creditCardValid = (creditCardNumber) => {
  const creditCardValidation = validateCreditCardNumber(creditCardNumber)

  const { isValid } = creditCardValidation

  const creditCardCompany = getCreditCardCompany(creditCardValidation)

  return {
    isCredCardValid: isValid,
    company: creditCardCompany,
  }
}

const find = async (id) => {
  let transaction
  try {
    transaction = await repository.find(id)
  } catch (error) {
    console.error(error.message)
  }

  return transaction
}

module.exports = {
  findAll,
  create,
  isValidRequest,
  creditCardValid,
  find,
}
