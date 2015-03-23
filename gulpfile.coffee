gulp = require 'gulp'
plugins = require('gulp-load-plugins')
  rename:
    'gulp-mocha-phantomjs': 'mocha'
sync = (plugins.sync gulp).sync


sources =
  src:
    coffee: 'src/event-dispatcher.coffee'
  build:
    js: 'build/event-dispatcher.js'
  test:
    cases: 'test/**/*.test.js'
    runner: 'test/event-dispatcher.test.html'


gulp.task 'coffee', ->
  gulp.src sources.src.coffee
    .pipe do plugins.plumber
    .pipe plugins.coffee
      bare: true
    .pipe gulp.dest 'build'

gulp.task 'uglify', ->
  gulp.src sources.build.js
    .pipe do plugins.plumber
    .pipe do plugins.uglify
    .pipe plugins.rename
      suffix: '.min'
    .pipe gulp.dest 'build'

gulp.task 'mocha', ->
  gulp.src sources.test.runner
    .pipe do plugins.plumber
    .pipe do plugins.mocha

gulp.task 'watch', ->
  gulp.watch sources.src.coffee, sync(['coffee', 'mocha'])
  gulp.watch sources.test.cases, ['mocha']
  gulp.watch sources.test.runner, ['mocha']

gulp.task 'build', sync([
  'coffee'
  'mocha'
  'uglify'
])