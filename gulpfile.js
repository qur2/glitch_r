var gulp = require('gulp');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var uglify = require('gulp-uglify');


gulp.task('browserify', function () {
  var browserified = transform(function(filename) {
    var b = browserify(filename);
    return b.bundle();
  });

  return gulp.src(['./src/app.js', './src/utils/pixel_compute.js'])
    .pipe(browserified)
    // .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('watch', function () {
   gulp.watch('src/**/*.js', ['browserify']);
});
