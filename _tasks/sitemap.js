'use strict'

// Dependencies
const path = require('path')
const gulp = require('gulp')
const sitemap = require('gulp-sitemap')
const { homepage } = require('../package.json')
const { dist } = require('../paths.json')

// Task exports
module.exports.sitemap = 'sitemap'

// Task configuration
gulp.task(module.exports.sitemap, () => {
  return gulp.src(path.join(dist.dir, '**/*.html'))
    .pipe(sitemap({ siteUrl: homepage }))
    .pipe(gulp.dest(dist.dir))
})
