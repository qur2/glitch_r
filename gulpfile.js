var args = require('yargs').argv;
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var config = require('./config').browserify;
var duration = require('gulp-duration');
var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var watchify = require('watchify');


var isWatching = !!args.watch;

/**
 * Inspiration taken from:
 * http://stefanimhoff.de/2014/gulp-tutorial-5-javascripts-browserify/
 * https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md
 */
gulp.task('browserify', function(callback) {
  // browsersync.notify('Compiling JavaScript');

  var bundleQueue = config.bundleConfigs.length;

  var buildBundle = function(bundleConfig) {
    var bundler = browserify(bundleConfig.entries, watchify.args);

    var bundle = function() {
      var timer = duration(bundleConfig.outputName);

      return bundler.bundle()
        // log errors if they happen
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        // Use vinyl-source-stream to make the
        // stream gulp compatible. Specifiy the
        // desired output filename here.
        .pipe(source(bundleConfig.outputName))
        .pipe(timer)
        // Specify the output destination
        .pipe(gulp.dest(bundleConfig.dest))
        .on('end', reportFinished);
    };

    if (isWatching) {
      // Wrap with watchify and rebundle on changes
      bundler = watchify(bundler);
      // Rebundle on update
      bundler.on('update', bundle);
    }
    bundler.transform('es6ify');

    var reportFinished = function() {
      if (!--bundleQueue) {
        // If queue is empty, tell gulp the task is complete.
        // https://github.com/gulpjs/gulp/blob/master/docs/API.md#accept-a-callback
        callback();
      }
    };

    return bundle();
  };

  // Start bundling with Browserify for each bundleConfig specified
  config.bundleConfigs.forEach(buildBundle);
});
