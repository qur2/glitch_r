module.exports = {
  // A separate bundle will be generated for each bundle config.
  // Each x-property is an extension used by the build script.
  // The prefix ensures no confusion with browserify options.
  bundleConfigs: [{
    xtarget:    'dist/js/app.js',
    xtransform: ['es6ify', 'lessify'],
    entries:      './src/app.js',
    extensions:   ['.js', '.less'],
    debug: true
  }, {
    xtarget:     'dist/js/pix-processor.js',
    xtransform:  ['es6ify'],
    entries:    './src/pix-processor.js',
    debug: true
  }]
};
