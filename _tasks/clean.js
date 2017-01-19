'use strict'

const del = require('del')
const { dist } = require('../paths.json')

module.exports = function clean() {

  return del([dist.glob])
}
