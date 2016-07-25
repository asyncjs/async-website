'use strict'

// Dependencies
const gulp = require('gulp')
const del = require('del')
const { dist } = require('../paths.json')

// Task exports
module.exports.clean = 'clean'

// Task configuration
gulp.task(module.exports.clean, () => {
  return del([dist.glob])
})
