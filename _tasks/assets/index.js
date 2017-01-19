'use strict'

const gulp = require('gulp')
const images = require('./images')
const scripts = require('./scripts')
const styles = require('./styles')

module.exports = gulp.parallel([images, scripts, styles])
