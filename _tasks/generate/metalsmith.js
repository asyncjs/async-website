'use strict'

const path = require('path')
const gulp = require('gulp')
const gulpsmith = require('gulpsmith')
const gulpFrontMatter = require('gulp-front-matter')
const drafts = require('metalsmith-drafts')
const markdown = require('metalsmith-markdown')
const permalinks = require('metalsmith-permalinks')
const helpers = require('metalsmith-register-helpers')
const tags = require('metalsmith-tags')
const boilerplates = require('metalsmith-layouts')
const templates = require('metalsmith-in-place')
const collections = require('metalsmith-collections')
const redirect = require('metalsmith-redirect')
const metadata = require('metalsmith-metadata')
const metadataInFilename = require('metalsmith-metadata-in-filename')
const buildDate = require('metalsmith-build-date')

const { reload } = require('../browser')
const { headlines, upcoming, past } = require('./filters')
const { includes, layouts, posts, pages, dist } = require('../../paths.json')

// Task configurations
module.exports = function metalsmith(cb) {

  gulp.src(['./site.json', pages.glob, posts.glob])

    // Expose metalsmith front-matter to gulp pipelines
    .pipe(gulpFrontMatter()).on('data', file => {
      Object.assign(file, file.frontMatter)
      delete file.frontMatter
    })

    .pipe(

      // Metalsmith piping
      gulpsmith()

      // Metalsmith metadata
      .use(metadataInFilename())
      .use(metadata({ site: 'site.json' }))
      .use(buildDate({ key: 'BUILD' }))
      .use(redirect({
        '/podcast': '/'
      }))

      // Metalsmith collections
      .use(collections({
        news: {
          sortBy: 'date',
          reverse: true
        },
        events: {
          sortBy: 'date',
          reverse: true
        },
        headlines: {
          pattern: '*.md',
          sortBy: 'date',
          reverse: true,
          refer: false,
          limit: 2,
          filter: headlines
        },
        upcoming: {
          pattern: '*.md',
          sortBy: 'date',
          refer: false,
          limit: 2,
          filter: upcoming
        },
        past: {
          pattern: '*.md',
          sortBy: 'date',
          reverse: true,
          refer: false,
          limit: 2,
          filter: past
        },
        soonest: {
          pattern: '*.md',
          sortBy: 'date',
          refer: false,
          limit: 1,
          filter: upcoming
        },
        latest: {
          pattern: '*.md',
          sortBy: 'date',
          reverse: true,
          refer: false,
          limit: 1,
          filter: past
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
            pattern: ':slug'
          },
          {
            match: { collection: 'news' },
            pattern: ':slug'
          }
        ]
      }))

      // Metalsmith register helpers
      .use(helpers({
        directory: path.join(includes.dir, 'helpers/')
      }))

      // Metalsmith tags
      .use(tags({
        layout: 'tag.html'
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
