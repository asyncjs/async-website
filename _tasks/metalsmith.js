'use strict'

// Dependencies
const fs = require('graceful-fs')
const path = require('path')
const through2 = require('through2')
const gulp = require('gulp')
const gutil = require('gulp-util')
const htmlhint = require('gulp-htmlhint')
const markdownlint = require('markdownlint')
const gulpsmith = require('gulpsmith')
const gulpFrontMatter = require('gulp-front-matter')
const drafts = require('metalsmith-drafts')
const markdown = require('metalsmith-markdown')
const permalinks = require('metalsmith-permalinks')
const boilerplates = require('metalsmith-layouts')
const templates = require('metalsmith-in-place')
const collections = require('metalsmith-collections')
const { includes, layouts, posts, pages, dist } = require('../paths.json')

// Consumed tasks
const { reloadFn } = require('./browser')

// Task exports
module.exports.smith = 'smith'
module.exports.lintIncludes = 'lint-includes'
module.exports.lintPartials = 'lint-partials'
module.exports.lintPosts = 'lint-posts'
module.exports.lintPages = 'lint-pages'
module.exports.lint = 'lint-smith'
module.exports.build = module.exports.smith

// Task configurations
gulp.task(module.exports.lintIncludes, () => {
  return gulp.src(path.join(includes.dir, '**/*.md'), { read: false })
    .pipe(through2.obj((file, enc, next) => {
      markdownlint({
        files: path.join(includes.dir, file.relative),
        config: JSON.parse(fs.readFileSync('.markdownlintrc', 'utf8'))
      }, (err, res) => {
        res = (res || '').toString()
        if (res) gutil.log(res)
        next(err, file)
      })
    }))
})

gulp.task(module.exports.lintPartials, () => {
  return gulp.src(path.join(includes.dir, '**/*.html'))
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(htmlhint.failReporter())
})

gulp.task(module.exports.lintPosts, cb => {
  gutil.log(`TODO: (help needed!) Linting for \'${posts.glob}\' currently disabled.`)
  cb()

  // return gulp.src(path.join(posts.dir, '**/*.md'), { read: false })
  //   .pipe(through2.obj((file, enc, next) => {
  //     markdownlint({
  //       files: path.join(posts.dir, file.relative),
  //       config: JSON.parse(fs.readFileSync('.markdownlintrc', 'utf8'))
  //     }, (err, res) => {
  //       res = (res || '').toString()
  //       next(res || err, file)
  //     })
  //   }))
})

gulp.task(module.exports.lintPages, () => {
  return gulp.src(pages.glob)
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(htmlhint.failReporter())
})

gulp.task(module.exports.lint, [
  module.exports.lintIncludes,
  module.exports.lintPartials,
  module.exports.lintPosts,
  module.exports.lintPages
])

gulp.task(module.exports.smith, cb => {
  gulp.src([pages.glob, posts.glob])

    // Expose metalsmith front-matter to gulp pipelines
    .pipe(gulpFrontMatter()).on('data', file => {
      Object.assign(file, file.frontMatter)
      delete file.frontMatter
    })

    .pipe(

      // Metalsmith piping
      gulpsmith()

      // Metalsmith collections
      .use(collections({
        events: {
          pattern: '*.md',
          sortBy: 'date',
          reverse: true
        }
      }))

      // Metalsmith posts
      .use(drafts())
      .use(markdown())
      .use(permalinks({
        relative: false,
        linksets: [
          {
            match: { collection: 'events' },
            pattern: ':title'
          },
          {
            match: { collection: 'news' },
            pattern: 'news/:title'
          }
        ]
      }))

      // Metalsmith pages
      .use(templates({
        engine: 'handlebars',
        partials: path.join(includes.dir, 'partials/')
      }))

      // Metalsmith layouts
      .use(boilerplates({
        engine: 'handlebars',
        partials: path.join(includes.dir, 'partials/'),
        directory: layouts.dir
      }))

    )
    .pipe(gulp.dest(dist.dir))
    .on('finish', () => {
      reloadFn()
      cb()
    })
})
