'use strict'

// Dependencies
const gulp = require('gulp')
const gutil = require('gulp-util')

// Task exports
module.exports.plumb = 'plumb'

// Task configuration
gulp.task(module.exports.plumb, () => {
  monkeyPatchPipe(gulp.src(''))
})

/**
 *  Monkey patch Gulp pipe to suppress errors in watch task
 *  @param {object} pipe Gulp stream
 */
function monkeyPatchPipe(stream) {
  while (!stream.hasOwnProperty('pipe')) {
    stream = Object.getPrototypeOf(stream)
    if (!stream) return null
  }

  let existingPipe = stream.pipe
  newPipe['$$monkey-patch'] = true
  return stream.pipe = newPipe

  /** Create new pipe copy of existing pipe */
  function newPipe() {
    let result = existingPipe.apply(this, arguments)
    result.setMaxListeners(0)
    if (!result.pipe['$$monkey-patch']) {
      monkeyPatchPipe(result)
    }

    return result.on('error', function(err) {
      gutil.log(gutil.colors.yellow(err))
      gutil.beep()
      this.emit('end')
    })
  }
}
