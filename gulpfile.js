var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');

// All javascript files
var jsFiles = ['*.js', './app/**/*.js'];

// Check good practices and style of js files
gulp.task('style', function () {

  return gulp.src(jsFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish', {
      verbose: true
    }))
    .pipe(jscs());
});

// Concatenate and compress all frontend javascript files 
gulp.task('scripts', function () {

  return gulp.src('./public/js/**/*.js')
    .pipe(concat('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/dist/js'));

});


// Concatenate and compress all css files
gulp.task('css-minify', function () {
  gulp.src('.public/css/**/*.css')
    .pipe(concat('all.min.css'))
    .pipe(cssmin())
    .pipe(gulp.dest('./public/dist/css'));
});


/* Inject css and js files both from vendors
specified in bower.json as project specific
We inject only in the layout files
TO-DO: specify in the layout whe to inject
and combine it with the static command to be
able to map static files */
gulp.task('inject', function () {

  var wiredep = require('wiredep').stream;
  var inject = require('gulp-inject');

  var injectSrc = gulp.src(['./public/css/*.css', './public/js/*.js'], {
    read: false
  });

  var injectOptions = {
    ignorePath: '/public'
  };

  var options = {
    bowerJson: require('./bower.json'),
    directory: './public/vendor',
    ignorePath: '../../public '
  };

  return gulp.src('./app/views/layouts/*.handlebars')
    .pipe(wiredep(options))
    .pipe(inject(injectSrc, injectOptions))
    .pipe(gulp.dest('./app/views/layouts'));

});




gulp.task('serve', ['style', 'inject'], function () {
  var options = {
    script: 'meadowlark.js',
    delayTime: 1,
    env: {
      'PORT': 3000
    },
    watch: jsFiles
  };

  return nodemon(options)
    .on('restart', function (env) {
      console.log('Restarting...');
    });

});