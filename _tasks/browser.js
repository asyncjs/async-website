'use strict'

const path = require('path')
const gulp = require('gulp')
const { dist } = require('../paths.json')
const browserSync = require('browser-sync').create()

module.exports = function browser() {

  return browserSync.init({
    injectChanges: true,
    server: { baseDir: dist.dir },
    files: path.join(dist.dir, 'css/**/*.css')
  })
}

module.exports.reload = browserSync.reload
module.exports.stream = browserSync.stream
