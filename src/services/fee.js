const R = require('ramda')

const FEE = {
  credit_card: 0.05,
  debit_card: 0.03,
}

const getFeeValueBasedOnPaymentType = type => FEE[type]

const calculateFeeAmount = (amount, feePercentage) => {
  const feeAmount = R.multiply(amount, feePercentage)

  return parseInt(feeAmount, 10)
}

const getFeeAmount = async (amount, paymentType) => {
  const feePercentage = await getFeeValueBasedOnPaymentType(paymentType)

  const feeAmount = calculateFeeAmount(amount, feePercentage)

  return feeAmount
}

module.exports = {
  getFeeAmount,
}
