'use strict'

// Dependencies
const path = require('path')
const gulp = require('gulp')
const { dist } = require('../paths.json')
const browser = require('browser-sync').create()

// Task exports
module.exports.browser = 'browser'
module.exports.init = 'browser-init'
module.exports.reloadFn = browser.reload
module.exports.streamFn = browser.stream

// Task configurations
gulp.task(module.exports.init, () => (browser.init({
  injectChanges: true,
  server: { baseDir: dist.dir },
  files: path.join(dist.dir, 'css/**/*.css')
})))

gulp.task(module.exports.browser, [module.exports.init])
