var combine = require('gulp-js-combine');
var run = require('run-sequence');
var babel = require('gulp-babel');
var jade = require('gulp-jade');
var gulp = require('gulp');
var nodeunit = require('gulp-nodeunit');
var gls = require('gulp-live-server');
var browserify = require('gulp-browserify');
var sass = require('gulp-sass-native');
var fontgen = require('gulp-fontgen');
var concatCss = require('gulp-concat-css');

// Import asset tasks
import assets from './gulp/assets';

gulp.task('default', ['templates', 'styles', 'scripts', 'client-scripts']);

/// Run tests
gulp.task('test', function (callback) {
  run('default', 'lib-scripts', 'nodeunit', callback);
});

gulp.task('nodeunit', function (callback) {
  return gulp.src('./build/**/*.tests.js').pipe(nodeunit());
});

/// Build all static templates
gulp.task('templates', function() {

  // Process all jade files in src/jade/ and push to public/
  gulp.src('./src/jade/*.jade')
    .pipe(jade({locals: {}}))
    .pipe(gulp.dest('./public/'));
});

/// Build all static templates
gulp.task('styles', function() {

  // Process all sass files in src/sass/ and push to public/
  gulp.src('./src/sass/*.scss')
    .pipe(sass().on('error', function(err) { console.log(err); }))
    .pipe(gulp.dest('./public/css'));
});

// Compile svg files into inline blocks
gulp.task('scripts', function() {
  gulp.src("/**/*.css")
    .pipe(svgMin())
    .pipe(inlineSvg({
        filename: '_svg-file.scss',
        template: 'mytemplate.mustache'
    }))
    .pipe(gulp.dest("sass"));
});

// Setup scripts for client and server
gulp.task('scripts', function() {

  // Process all js files from es6 to browser compatible
  gulp.src(['./src/scripts/server/**/*.js'])
    .pipe(babel())
    .pipe(gulp.dest('./build/server'));

  // Add libs folder for server
  gulp.src(['./src/scripts/lib/**/*.js', '!./src/scripts/lib/**/*.tests.js'])
    .pipe(babel())
    .pipe(gulp.dest('./build/server/lib'));
});

// Setup scripts for client and server
gulp.task('client-scripts', function() {

  // Process all js files from es6 to browser compatible
  gulp.src(['./src/scripts/client/**/*.js'])
    .pipe(babel())
    .pipe(gulp.dest('./build/client'));

  // Add libs folder for client
  gulp.src(['./src/scripts/lib/**/*.js', '!./src/scripts/lib/**/*.tests.js'])
    .pipe(babel())
    .pipe(gulp.dest('./build/client/lib'));

  // Process all js files from es6 to browser compatible
  gulp.src('./build/client/*.js')
    .pipe(browserify({
       insertGlobals : true,
       debug : true,
    }))
    .pipe(gulp.dest('./public/js'));
});

// Compile lib scripts and tests
gulp.task('lib-scripts', function() {
  return gulp.src(['./src/scripts/lib/**/*.js'])
    .pipe(babel())
    .pipe(gulp.dest('./build/lib'));
});

gulp.task('server', ['default'], function() {

  // Start the server at the beginning of the task
  var server = gls.new('index.js');
  server.start();

  // Watch for changes
  gulp.watch(['src/jade/**/*.jade'], ['templates']);
  gulp.watch(['src/sass/**/*.scss'], ['styles']);
  gulp.watch(['src/scripts/lib/**/*.js'], ['scripts', 'client-scripts']);
  gulp.watch(['src/scripts/client/**/*.js'], ['client-scripts']);
  gulp.watch(['src/scripts/server/**/*.js'], ['scripts']);
  gulp.watch(['build/server/**/*.js'], function() {
    server.stop().then(function() {
      server.start();
    });
  });
});
