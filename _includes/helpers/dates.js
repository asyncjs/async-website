'use strict'

const moment = require('moment')

module.exports.timestamp = date => moment.utc(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format()
module.exports.day = date => moment.utc(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('dddd, Do MMMM YYYY')
module.exports.time = date => moment.utc(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('h:mma')
