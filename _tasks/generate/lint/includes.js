'use strict'

const fs = require('graceful-fs')
const path = require('path')
const through2 = require('through2')
const gulp = require('gulp')
const gutil = require('gulp-util')
const markdownlint = require('markdownlint')
const { includes } = require('../../../paths.json')

module.exports = function lintIncludes() {

  return gulp.src(path.join(includes.dir, '**/*.md'), { read: false })
    .pipe(through2.obj((file, enc, next) => {
      markdownlint({
        files: path.join(includes.dir, file.relative),
        config: JSON.parse(fs.readFileSync('.markdownlintrc', 'utf8'))
      }, (err, res) => {
        res = (res || '').toString()
        if (res) gutil.log(res)
        next(err, file)
      })
    }))
}
