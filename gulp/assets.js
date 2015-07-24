// All the one-time asset configuration scripts go here
var gulp = require('gulp');
var run = require('run-sequence');
var fontgen = require('gulp-fontgen');
var concatCss = require('gulp-concat-css');
var svgSprite = require('gulp-svg-sprite');
import config from './config';

/// All asset builds
gulp.task('assets', ['fonts', 'svg']);

/// Build all fonts into webfonts
gulp.task('fonts', function(callback) {
  run('fonts-build', 'fonts-combine', callback);
});

gulp.task('fonts-build', function() {
  return gulp.src(`${config.src}/fonts/*.ttf`)
    .pipe(fontgen({
      dest: `${config.public}/fonts`
    }));
});

gulp.task('fonts-combine', function() {
  return gulp.src(`${config.public}/fonts/*.css`)
    .pipe(concatCss("fonts.css"))
    .pipe(gulp.dest(`${config.public}/fonts`));
});

/// Build svg icons
gulp.task('svg', function() {
  return gulp.src(`${config.src}/svg/**/*.svg`)
      .pipe(svgSprite({
        mode : {
          css : {
            render : { css : true }
          }
        }}))
      .pipe(gulp.dest(`${config.public}/svg`));
})
