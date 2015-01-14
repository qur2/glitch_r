var args = require('yargs').argv;
var browserify = require('browserify');
var config = require('./config');
var duration = require('gulp-duration');
var fs = require('fs');
var watchify = require('watchify');
var xtend = require('xtend');


var buildBundle = function(bundleConfig) {
  var bundler = browserify(xtend(watchify.args, bundleConfig));

  var bundle = function() {
    var timer = duration(bundleConfig.xtarget);

    return bundler.bundle()
      .on('error', console.log.bind(console, 'Browserify Error'))
      .pipe(timer).pipe(fs.createWriteStream(bundleConfig.xtarget));
  };

  if (!!args.watch) {
    // Wrap with watchify and rebundle on changes
    bundler = watchify(bundler);
    // Rebundle on update
    bundler.on('update', bundle);
  }
  bundleConfig.xtransform.forEach(function (t) {
    bundler.transform(t);
  });

  return bundle();
};

// Start bundling with Browserify for each bundleConfig specified
config.bundleConfigs.forEach(buildBundle);
