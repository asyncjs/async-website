'use strict'

const path = require('path')
const gulp = require('gulp')
const sync = require('gulp-directory-sync')
const { images, assets, dist } = require('../../paths.json')

module.exports = function copyImages() {

  return gulp.src('./', { read: false })
    .pipe(sync(images.dir, path.join(dist.dir, 'img/')))
    .pipe(sync(path.join(assets.dir, 'wp/'), path.join(dist.dir, 'wp/')))
}
