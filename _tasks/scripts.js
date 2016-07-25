'use strict'

// Dependencies
const path = require('path')
const gulp = require('gulp')
const eslint = require('gulp-eslint')
const jscs = require('gulp-jscs')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const sourcemaps = require('gulp-sourcemaps')
const { scripts, dist } = require('../paths.json')

// Consumed tasks
const { reloadFn } = require('./browser')

// Task exports
module.exports.scripts = 'scripts'
module.exports.lint = 'lint-scripts'
module.exports.build = module.exports.scripts

// Task configuration
gulp.task(module.exports.lint, () => {
  return gulp.src(scripts.glob)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(jscs({ fix: true }))
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'))
    .pipe(gulp.dest(scripts.dir))
})

gulp.task(module.exports.scripts, cb => {
  gulp.src(scripts.glob)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.join(dist.dir, 'js/')))
    .on('finish', () => {
      reloadFn()
      cb()
    })
})
