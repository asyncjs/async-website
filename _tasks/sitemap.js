'use strict'

const path = require('path')
const gulp = require('gulp')
const gulpSitemap = require('gulp-sitemap')
const { homepage } = require('../package.json')
const { dist } = require('../paths.json')

module.exports = function sitemap() {

  return gulp.src(path.join(dist.dir, '**/*.html'))
    .pipe(gulpSitemap({ siteUrl: homepage }))
    .pipe(gulp.dest(dist.dir))
}
