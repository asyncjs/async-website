'use strict'

// Dependencies
const gulp = require('gulp')
const runSequence = require('run-sequence')

// Consumed tasks
const { browser } = require('./_tasks/browser')
const { watch } = require('./_tasks/watch')
const { clean } = require('./_tasks/clean')
const { images } = require('./_tasks/images')
const { sitemap } = require('./_tasks/sitemap')
const scripts = require('./_tasks/scripts')
const styles = require('./_tasks/styles')
const metalsmith = require('./_tasks/metalsmith')

// Task configuration
gulp.task('default', [browser, watch])

gulp.task('build', [clean], cb => {
  return runSequence([
    images,
    sitemap,
    scripts.lint,
    scripts.build,
    styles.lint,
    styles.build,
    metalsmith.lint,
    metalsmith.build
  ], cb)
})
