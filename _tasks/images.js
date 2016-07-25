'use strict'

// Dependencies
const path = require('path')
const gulp = require('gulp')
const gutil = require('gulp-util')
const sync = require('gulp-directory-sync')
const { images, dist } = require('../paths.json')

// Task exports
module.exports.images = 'images'

// Task configuration
gulp.task(module.exports.images, () => {
  return gulp.src('./', { read: false })
    .pipe(sync(images.dir, path.join(dist.dir, 'img/'), {
      printSummary: true
    }))
})
