'use strict'

const moment = require('moment')

// Recent news headlines
module.exports.headlines = ({ collection, date }) => (
  collection.includes('news') &&
  moment(date).isSameOrAfter(moment().subtract(2, 'months'))
)

// Upcoming events
module.exports.upcoming = ({ collection, date }) => (
  collection.includes('events') &&
  moment(date).isSameOrAfter(moment(), 'day')
)

// Past events
module.exports.past = ({ collection, date }) => (
  collection.includes('events') &&
  moment(date).isBefore(moment(), 'day')
)
