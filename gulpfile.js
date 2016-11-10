const gulp      = require('gulp'),
      include   = require('gulp-include'),
      rename    = require('gulp-rename'),
      uglifyjs  = require('uglify-js'),
      gutil     = require('gulp-util'),
      uglify    = require('gulp-uglify'),
      minifier  = require('gulp-uglify/minifier'),
      es6tr     = require('gulp-es6-transpiler'),
      jshint    = require('gulp-jshint'),
      babel     = require('gulp-babel'),
      del       = require('del'),
      pump      = require('pump')

gulp.task('clean', function () {
  return del(['bin/*.js'])
});

gulp.task('lint', function () {
  return gulp.src('src/**/*.js')
    .pipe(jshint({ esversion: 6 }))
    .pipe(jshint.reporter('default'));
});

gulp.task('build', ['clean', 'lint'], function () {
  return gulp.src('src/main.js')
    .pipe(include({ extensions: 'js' }))
      .on('error', console.log)
    .pipe(rename('kongOne.user.js'))
    .pipe(gulp.dest('bin'));
});

gulp.task('es6', ['build'], function () {
  return gulp.src('bin/kongOne.user.js')
    // .pipe(es6tr({
    //   environments: ['browser', 'devel', 'prototypejs'],
    //   globals: {
    //     unsafeWindow: false,
    //     GM_getValue: true,
    //     GM_setValue: true,
    //     GM_deleteValue: true,
    //     holodeck: false
    //   }
    // }))
    .pipe(babel({presets: ['es2015']}))
    .pipe(gulp.dest('bin'));
});

gulp.task('uglify', ['build', 'es6'], function () {
  return gulp.src('bin/kongOne.user.js')
    .pipe(uglify().on('error', gutil.log))
    .pipe(gulp.dest('bin'));
});

gulp.task('watch', function() {
  gulp.watch('src/userscripts/*.js', ['build']);
});


gulp.task('default', ['clean', 'lint', 'build', 'es6','uglify']);
