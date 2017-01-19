'use strict'

const gulp = require('gulp')
const htmlhint = require('gulp-htmlhint')
const { pages } = require('../../../paths.json')

module.exports = function lintPages() {

  return gulp.src(pages.glob)
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(htmlhint.failReporter())
}
