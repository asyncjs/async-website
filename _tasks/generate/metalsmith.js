'use strict'

const path = require('path')
const gulp = require('gulp')
const gulpsmith = require('gulpsmith')
const gulpFrontMatter = require('gulp-front-matter')
const tags = require('metalsmith-tags')
const feed = require('metalsmith-feed')
const drafts = require('metalsmith-drafts')
const markdown = require('metalsmith-markdown')
const permalinks = require('metalsmith-permalinks')
const helpers = require('metalsmith-register-helpers')
const boilerplates = require('metalsmith-layouts')
const templates = require('metalsmith-in-place')
const collections = require('metalsmith-collections')
const archive = require('metalsmith-collections-archive')
const filterCollections = require('metalsmith-collections-filter')
const offsetCollections = require('metalsmith-collections-offset')
const limitCollections = require('metalsmith-collections-limit')
const redirect = require('metalsmith-redirect')
const metadata = require('metalsmith-metadata')
const metadataInFilename = require('metalsmith-metadata-in-filename')
const buildDate = require('metalsmith-build-date')
const excerpts = require('metalsmith-excerpts')
const more = require('metalsmith-more')

const { reload } = require('../browser')
const { customElements } = require('./feed')
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

      // Metalsmith drafts
      .use(drafts())

      // Metalsmith metadata
      .use(metadataInFilename({ match: '*.md' }))
      .use(metadata({ site: 'site.json' }))
      .use(buildDate({ key: 'BUILD' }))
      .use(redirect({
        '/podcast': '/',
        '/feed': '/feed/atom/index.xml'
      }))

      // Metalsmith collections
      .use(collections({
        rss: {
          pattern: '*.md',
          reverse: true,
          refer: false
        },
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
          refer: false
        },
        upcoming: {
          pattern: '*.md',
          sortBy: 'date',
          refer: false
        },
        past: {
          pattern: '*.md',
          sortBy: 'date',
          reverse: true,
          refer: false
        },
        soonest: {
          pattern: '*.md',
          sortBy: 'date',
          refer: false
        },
        latest: {
          pattern: '*.md',
          sortBy: 'date',
          reverse: true,
          refer: false
        }
      }))
      .use(filterCollections({
        headlines,
        upcoming,
        past,
        soonest: upcoming,
        latest: past
      }))
      .use(offsetCollections({
        upcoming: 1
      }))
      .use(limitCollections({
        headlines: 2,
        upcoming: 2,
        past: 2,
        soonest: 1,
        latest: 1
      }))

      // Metalsmith posts
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

      // Metalsmith excerpts
      .use(excerpts())
      .use(more())

      // Metalsmith register helpers
      .use(helpers({
        directory: path.join(includes.dir, 'helpers/')
      }))

      // Metalsmith archive
      .use(archive({
        layout: 'archive.html',
        collections: {
          news: true,
          events: true
        }
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

      // Metalsmith RSS feed
      .use(feed({
        collection: 'rss',
        limit: false,
        destination: 'feed/atom/index.xml',
        postDescription: ({ less, contents }) => less || contents,
        postCustomElements: customElements
      }))

      // .use((files, meta, done) => {
      //   for (let key in files) {
      //     if (files[key].hasOwnProperty('collection'))
      //       console.dir(files[key])
      //   }

      //   done()
      // })

    )
    .pipe(gulp.dest(dist.dir))
    .on('finish', () => {
      reload()
      cb()
    })
}
