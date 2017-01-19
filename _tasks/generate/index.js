'use strict'

const gulp = require('gulp')
const lint = require('./lint/index')
const metalsmith = require('./metalsmith')

module.exports = gulp.series([lint, metalsmith])
