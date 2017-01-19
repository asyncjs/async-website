'use strict'

const gulp = require('gulp')
const tasks = require('./_tasks/index')

gulp.task('default', gulp.series([
  tasks.clean,
  tasks.generate,
  tasks.assets,
  tasks.sitemap
]))

gulp.task('watch', gulp.parallel([
  tasks.browser,
  tasks.watch
]))
