'use strict'

const gulp = require('gulp')
const includes = require('./includes')
const partials = require('./partials')
const pages = require('./pages')
const posts = require('./posts')

module.exports = gulp.parallel([includes, partials, pages, posts])
