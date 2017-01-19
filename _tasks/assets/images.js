'use strict'

const path = require('path')
const gulp = require('gulp')
const gutil = require('gulp-util')
const sync = require('gulp-directory-sync')
const { images, dist } = require('../../paths.json')

module.exports = function copyImages() {

  return gulp.src('./', { read: false })
    .pipe(sync(images.dir, path.join(dist.dir, 'img/'), {
      printSummary: true
    }))
}
