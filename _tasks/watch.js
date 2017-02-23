'use strict'

const gulp = require('gulp')
const paths = require('../paths.json')
const images = require('./assets/images')
const scripts = require('./assets/scripts')
const styles = require('./assets/styles')
const generate = require('./generate/index')

module.exports = function watch() {

  // Images
  gulp.watch([paths.images.glob], images)

  // Scripts
  gulp.watch([paths.scripts.glob], scripts)

  // Styles
  gulp.watch([paths.styles.glob], styles)

  // Generate
  gulp.watch([
    paths.includes.glob,
    paths.layouts.glob,
    paths.posts.glob,
    paths.pages.glob
  ], generate)
}
