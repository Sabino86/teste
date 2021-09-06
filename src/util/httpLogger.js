const log4js = require('log4js')

const log4jsConfig = {
  appenders: [{
    type: 'console',
    layout: {
      type: 'pattern',
      pattern: '%m',
    },
  }],
}
log4js.configure(log4jsConfig)

module.exports = log4js.getLogger('tiny psp')
