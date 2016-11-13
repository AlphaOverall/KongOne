const gulp      = require('gulp'),
      include   = require('gulp-include'),
      rename    = require('gulp-rename'),
      gutil     = require('gulp-util'),
      uglify    = require('gulp-uglify'),
      jshint    = require('gulp-jshint'),
      babel     = require('gulp-babel'),
      concat    = require('gulp-concat'),
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
    .pipe(babel({presets: ['es2015']}))
    .pipe(gulp.dest('bin'));
});

gulp.task('uglify', ['build', 'es6'], function () {
  return gulp.src('bin/kongOne.user.js')
    .pipe(uglify().on('error', gutil.log))
    .pipe(gulp.dest('bin'));
});

gulp.task('userscript', ['uglify'], function () {
  return gulp.src(['src/userscriptDefinition.js', 'bin/kongOne.user.js'])
    .pipe(concat('kongOne.user.js'))
    .pipe(gulp.dest('bin'))
});

gulp.task('watch', function() {
  gulp.watch('src/userscripts/*.js', ['build']);
});

gulp.task('default', ['clean', 'lint', 'build', 'es6', 'uglify', 'userscript']);
