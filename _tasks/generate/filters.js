'use strict'

const moment = require('moment')

// Recent news headlines
module.exports.headlines = ({ collection, date }) => (
  collection.includes('news') &&
  moment(date).isSameOrAfter(moment('2013-05-20').subtract(2, 'months'))
)

// Upcoming events
module.exports.upcoming = ({ collection, date }) => (
  collection.includes('events') &&
  moment(date).isSameOrAfter(moment('2016-01-20'), 'day')
)

// Past events
module.exports.past = ({ collection, date }) => (
  collection.includes('events') &&
  moment(date).isBefore(moment('2016-01-20'), 'day')
)
