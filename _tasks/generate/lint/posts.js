'use strict'

// const fs = require('graceful-fs')
const path = require('path')
// const through2 = require('through2')
const gulp = require('gulp')
const gutil = require('gulp-util')
// const markdownlint = require('markdownlint')
const { posts } = require('../../../paths.json')

module.exports = function lintPosts(done) {
  gutil.log(`TODO: (help needed!) Linting for '${posts.glob}' currently disabled.`)
  done()

  // return gulp.src(path.join(posts.dir, '**/*.md'), { read: false })
  //   .pipe(through2.obj((file, enc, next) => {
  //     markdownlint({
  //       files: path.join(posts.dir, file.relative),
  //       config: JSON.parse(fs.readFileSync('.markdownlintrc', 'utf8'))
  //     }, (err, res) => {
  //       res = (res || '').toString()
  //       next(res || err, file)
  //     })
  //   }))
}
