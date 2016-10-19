/// <binding BeforeBuild='less' />
var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');


gulp.task('default', function () {
    // place code for your default task here
});

gulp.task('restore', function () {
    gulp.src([
        'node_modules/@angular/**/*.*',
        'node_modules/angular2-in-memory-web-api/*.js',
        'node_modules/rxjs/**/*.*',
        'node_modules/systemjs/dist/*.js',
        'node_modules/zone.js/dist/*.js',
        'node_modules/core-js/client/*.js',
        'node_modules/reflect-metadata/reflect.js',
        'node_modules/jquery/dist/*.js',
        'node_modules/bootstrap/dist/**/*.*',
        'node_modules/phantomjs-prebuilt/**/*.js',
        'node_modules/d3/**/*.js'
    ], { base: 'node_modules' }).pipe(gulp.dest('./wwwroot/libs'));
});

gulp.task('less', function () {
  return gulp.src('./wwwroot/app/Less/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./wwwroot/css'));
});
