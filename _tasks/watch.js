'use strict'

// Dependencies
const gulp = require('gulp')
const paths = require('../paths.json')

// Consumed tasks
const { plumb } = require('./plumb')
const { images } = require('./images')
const { scripts } = require('./scripts')
const { styles } = require('./styles')
const { smith } = require('./metalsmith')

// Task exports
module.exports.watch = 'watch'

// Task configuration
gulp.task(module.exports.watch, [plumb], () => {

  // Images
  gulp.watch([paths.images.glob], [images])

  // Scripts
  gulp.watch([paths.scripts.glob], [scripts])

  // Styles
  gulp.watch([paths.styles.glob], [styles])

  // Metalsmith
  gulp.watch([
    paths.includes.glob,
    paths.layouts.glob,
    paths.posts.glob,
    paths.pages.glob
  ], [smith])

})
