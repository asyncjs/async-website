'use strict'

const moment = require('moment')

module.exports.timestamp = date => moment(date).format()
module.exports.day = date => moment(date).format('dddd, DD MMMM YYYY')
module.exports.time = date => moment(date).format('h:mma')
