var gulp = require('gulp');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var neat = require('node-neat').includePaths;

// Browserify task
gulp.task('browserify', function () {
  var browserified = transform(function (filename) {
    var b = browserify(filename);
    return b.bundle();
  });

  return gulp.src(['./public/src/js/*.js'])
    .pipe(browserified)
    .pipe(uglify())
    .pipe(gulp.dest('./public/build/js'));
});

// Sass task
gulp.task('sass', function () {
  gulp.src('./public/src/sass/main.scss')
    .pipe(sass({
      style: 'expanded',
      includePaths: neat
    }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('./public/build/css'))
    .pipe(minify())
    .pipe(gulp.dest('./public/build/css'));
});

gulp.task('watch', function () {
  gulp.watch('public/src/**/*.*', ['default']);
});

gulp.task('default', ['sass', 'browserify']);