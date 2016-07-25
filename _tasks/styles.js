'use strict'

// Dependencies
const path = require('path')
const gulp = require('gulp')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const scsslint = require('gulp-scss-lint')
const uncss = require('gulp-uncss')
const cssnano = require('gulp-cssnano')
const sourcemaps = require('gulp-sourcemaps')
const { styles, dist } = require('../paths.json')

// Task exports
module.exports.styles = 'styles'
module.exports.lint = 'lint-styles'
module.exports.build = module.exports.styles

// Task configuration
gulp.task(module.exports.lint, () => {
  return gulp.src(styles.glob)
    .pipe(scsslint())
    .pipe(scsslint.failReporter())
})

gulp.task(module.exports.styles, () => {
  gulp.src(styles.glob)
    .pipe(sourcemaps.init())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer({ browsers: ['> 1%'], cascade: false }))
    .pipe(uncss({ html: [path.join(dist.dir, '**/*.html')] }))
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.join(dist.dir, 'css/')))
})
