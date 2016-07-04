'use strict'

// utils
const _ = require('lodash')

// for the forge
const MATERIALS = {
  clean: {
    dir: './dist/',
    path: './dist/',
    ignore: true
  },
  styles: {
    dir: './_assets/styles/',
    path: './_assets/styles/**/*.scss',
    stream: true
  },
  scripts: {
    dir: './_assets/scripts/',
    path: './_assets/scripts/**/*.js'
  },
  images: {
    dir: './_assets/images/',
    path: './_assets/images/**'
  },
  layouts: {
    dir: './_layouts/',
    path: './_layouts/**/*.html'
  },
  posts: {
    dir: './_posts/',
    path: './_posts/**/*.md',
    ignore: true
  },
  pages: {
    dir: './_pages/',
    path: './_pages/**/*.html'
  }
}

// for ubiquity
const SOURCE_MATERIALS = _.omitBy(MATERIALS, ({ignore}) => ignore)
const RELOAD_MATERIALS = _.omitBy(SOURCE_MATERIALS, ({stream}) => stream)
const STREAM_MATERIALS = _.pickBy(SOURCE_MATERIALS, ({stream}) => stream)

SOURCE_MATERIALS.reload = { path: _.map(RELOAD_MATERIALS, 'path') }

// pipelines
var gulp = require('gulp')
var clean = require('gulp-clean')
var dirSync = require('gulp-directory-sync')
var autowatch = require('gulp-autowatch')
var sass = require('gulp-sass')
var autoprefixer = require('gulp-autoprefixer')
var scsslint = require('gulp-scss-lint')
var uncss = require('gulp-uncss')
var cssnano = require('gulp-cssnano')
var babel = require('gulp-babel')
var uglify = require('gulp-uglify')
var sourcemaps = require('gulp-sourcemaps')
var sitemap = require('gulp-sitemap')
var extReplace = require('gulp-ext-replace')
var runSequence = require('run-sequence')
var browserSync = require('browser-sync').create()

// smiths
var gulpsmith = require('gulpsmith')
var gulpFrontMatter = require('gulp-front-matter')
var drafts = require('metalsmith-drafts')
var markdown = require('metalsmith-markdown')
var permalinks = require('metalsmith-permalinks')
var layouts = require('metalsmith-layouts')
var templates = require('metalsmith-in-place')
var collections = require('metalsmith-collections')

gulp.task('clean', () => {
  return gulp.src(MATERIALS.clean.path, { read: false })
    .pipe(clean({ force: true }))
})

gulp.task('sync', () => {
  return gulp.src('./', { read: false })
    .pipe(dirSync(MATERIALS.images.dir, MATERIALS.clean.dir + 'img/'))
    .pipe(dirSync(MATERIALS.pages.dir + 'labs/', MATERIALS.clean.dir + 'labs/', {
      ignore: ['.html', '.md']
    }))
})

gulp.task('images', ['sync'])

gulp.task('layouts', ['pages'])
// gulp.task('layouts', ['posts', 'pages'])

// gulp.task('posts', () => {
//   return gulp.src(MATERIALS.posts.path)
//     // expose metalsmith front-matter to gulp pipelines
//     .pipe(gulpFrontMatter()).on('data', file => {
//       _.assign(file, file.frontMatter)
//       delete file.frontMatter
//     })
//     .pipe(
//       // pipe wrapped
//       // metalsmith config
//       gulpsmith()

//       // metalsmith pipes
//       .use(drafts())
//       .use(markdown())
//       .use(permalinks({
//         "pattern": ":title",
//         "relative": false
//       }))
//       .use(layouts({
//         engine: 'swig',
//         directory: MATERIALS.layouts.dir
//       }))
//     )
//     .pipe(gulp.dest(MATERIALS.clean.path))
// })

gulp.task('pages', ['sync'], () => {
  return gulp.src([MATERIALS.pages.path, MATERIALS.posts.path])
    // expose metalsmith front-matter to gulp pipelines
    .pipe(gulpFrontMatter()).on('data', file => {
      _.assign(file, file.frontMatter)
      delete file.frontMatter
    })
    .pipe(
      // pipe wrapped
      // metalsmith config
      gulpsmith()

      // metalsmith pipes
      .use(drafts())
      .use(markdown())
      .use(permalinks({
        "pattern": ":title",
        "relative": false
      }))
      .use(collections({
        news: {
          sortBy: 'date',
          reverse: true
        },
        events: {
          sortBy: 'date',
          reverse: true
        }
      }))
      .use(templates({
        engine: 'swig'
      }))
      .use(layouts({
        engine: 'swig',
        directory: MATERIALS.layouts.dir
      }))
    )
    .pipe(gulp.dest(MATERIALS.clean.path))
})

gulp.task('styles-global', () => {
  return gulp.src(MATERIALS.styles.dir + 'global/**/*.scss')
    .pipe(scsslint())
    .pipe(scsslint.failReporter())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer({ browsers: ['> 1%'], cascade: false }))
    .pipe(uncss({ html: [MATERIALS.clean.dir + '**/*.html'] }))
    .pipe(cssnano())
    .pipe(gulp.dest(MATERIALS.clean.dir + 'css/'))
    .pipe(browserSync.stream({ match: '**/*.css' }))
})

gulp.task('styles-pages', () => {
  return gulp.src(MATERIALS.styles.dir + 'pages/**/*.scss')
    .pipe(scsslint())
    .pipe(scsslint.failReporter())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer({ browsers: ['> 1%'], cascade: false }))
    .pipe(uncss({ html: [MATERIALS.clean.dir + '**/*.html'] }))
    .pipe(cssnano())
    .pipe(gulp.dest(MATERIALS.clean.dir + 'css/'))
    .pipe(browserSync.stream({ match: '**/*.css' }))
})

gulp.task('styles', ['layouts'], cb => {
  return runSequence('styles-global', 'styles-pages', cb)
})

gulp.task('scripts-global', () => {
  return gulp.src(MATERIALS.scripts.dir + 'global/**/*.js')
    .pipe(extReplace('.js', '.es2015.js'))
    .pipe(sourcemaps.init())
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(MATERIALS.clean.dir + 'js/'))
})

gulp.task('scripts-pages', () => {
  return gulp.src(MATERIALS.scripts.dir + 'pages/**/*.js')
    .pipe(extReplace('.js', '.es2015.js'))
    .pipe(sourcemaps.init())
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(MATERIALS.clean.dir + 'js/'))
})

gulp.task('scripts', cb => {
  return runSequence('scripts-global', 'scripts-pages', cb)
})

gulp.task('sitemap', () => {
  return gulp.src(MATERIALS.clean.dir + '**/*.html')
    .pipe(sitemap({ siteUrl: 'http://asyncjs.com/' }))
    .pipe(gulp.dest(MATERIALS.clean.dir))
})

// uses run-sequence Gulp@4.0.0 polyfill
var forgeSequence = _.keys(SOURCE_MATERIALS)

// master forge for all MATERIALS
gulp.task('forge', cb => {
  return runSequence('clean', forgeSequence, 'sitemap', cb)
})

// local environment server
gulp.task('serve-seq', () => {
  return browserSync.init({ server: MATERIALS.clean.path })
})

// gulp.task('serve', ['forge'], () => {
gulp.task('serve', cb => {
  return runSequence('clean', forgeSequence, 'serve-seq', cb)
})

// local environment auto-reload
gulp.task('reload', _.debounce(() => {
  return browserSync.reload()
}, 300))

// master forge with a tale to tell
gulp.task('forge-watch-seq', () => {
  return autowatch(gulp, _.mapValues(SOURCE_MATERIALS, 'path'))
})

gulp.task('forge:watch', cb => {
  return runSequence('clean', forgeSequence, 'serve-seq', 'forge-watch-seq', cb)
})
