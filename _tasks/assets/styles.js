'use strict'

const path = require('path')
const gulp = require('gulp')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const scsslint = require('gulp-scss-lint')
const uncss = require('gulp-uncss')
const cssnano = require('gulp-cssnano')
const sourcemaps = require('gulp-sourcemaps')
const { styles, dist } = require('../../paths.json')

function lintStyles() {

  return gulp.src(styles.glob)
    .pipe(scsslint())
    .pipe(scsslint.failReporter())
}

function buildStyles() {

  return gulp.src(styles.glob)
    .pipe(sourcemaps.init())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer({ browsers: ['> 1%'], cascade: false }))
    .pipe(uncss({ html: [path.join(dist.dir, '**/*.html')] }))
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.join(dist.dir, 'css/')))
}

module.exports = gulp.series([lintStyles, buildStyles])
