'use strict'

// Dependencies
const path = require('path')
const gulp = require('gulp')
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
gulp.task(module.exports.lintIncludes, () => { /* markdown lint */ })

gulp.task(module.exports.lintPartials, () => { /* html lint */ })

gulp.task(module.exports.lintPosts, () => { /* markdown lint */ })

gulp.task(module.exports.lintPages, () => { /* html lint */ })

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
