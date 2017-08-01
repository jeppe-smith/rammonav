const gulp = require('gulp')
const plugins = require('gulp-load-plugins')()
const browserify = require('browserify')
const watchify = require('watchify')
const babelify = require('babelify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const sync = require('browser-sync').create()

function bundle(bundler) {
  return bundler
    .bundle()
    .on('error', error => {
      plugins.util.log(error.message)
    })
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./test'))
}

gulp.task('scripts', () => {
  let bundler = null

  if (process.env.NODE_ENV === 'production') {
    bundler = browserify({
      entries: ['./test/scripts.js'],
      debug: false
    })
  } else {
    bundler = browserify({
      entries: ['./test/scripts.js'],
      debug: true,
      cache: {},
      packageCache: {},
      plugin: [watchify]
    })

    bundler.on('update', () => bundle(bundler))

    bundler.on('log', plugins.util.log)
  }

  bundler.transform(babelify)

  return bundle(bundler)
})

gulp.task('styles', () => {
  return gulp
    .src('./test/styles.scss')
    .pipe(plugins.sass())
    .pipe(gulp.dest('./test'))
    .pipe(sync.stream())
})

gulp.task('serve', () => {
  sync.init({
    server: './test'
  })
})

gulp.task('watch', () => {
  gulp.watch('./test/styles.scss', ['styles'])
  gulp.watch('./test/index.html').on('change', sync.reload)
  gulp.watch('./test/bundle.js').on('change', sync.reload)  
})

gulp.task('default', () => {
  gulp.start('scripts')
  gulp.start('styles')
  gulp.start('serve')

  if (process.env.NODE_ENV !== 'production') {
    gulp.start('watch')
  }
})