'use strict'

const path = require('path')
const gulp = require('gulp')
const htmlhint = require('gulp-htmlhint')
const { includes } = require('../../../paths.json')

module.exports = function lintPartials() {

  return gulp.src(path.join(includes.dir, '**/*.html'))
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(htmlhint.failReporter())
}
