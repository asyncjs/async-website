'use strict'

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

const { reload } = require('../browser')
const { includes, layouts, posts, pages, dist } = require('../../paths.json')

// Task configurations
module.exports = function metalsmith(cb) {

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
      reload()
      cb()
    })
}
