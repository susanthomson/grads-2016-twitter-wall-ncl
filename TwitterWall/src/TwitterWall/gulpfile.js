var gulp = require('gulp');
var path = require('path');


gulp.task('default', ['prod']);

gulp.task('copy:libs', function () {
    return gulp.src([
        'node_modules/@angular/**/*.*',
        'node_modules/angular2-in-memory-web-api/*.js',
        'node_modules/rxjs/**/*.*',
        'node_modules/vague-time/**/*.*',
        'node_modules/systemjs/dist/*.js',
        'node_modules/zone.js/dist/*.js',
        'node_modules/core-js/client/*.js',
        'node_modules/reflect-metadata/reflect.js',
        'node_modules/jquery/dist/*.js',
        'node_modules/bootstrap/dist/**/*.*',
        'node_modules/phantomjs-prebuilt/**/*.js',
        'node_modules/d3/**/*.js',
        'node_modules/moment/**/*.js',
    ], { base: 'node_modules' }).pipe(gulp.dest('./Client/libs'));
});

function copyTask(from, to, opts = {}) {
    return () => gulp.src(from, opts).pipe(gulp.dest(to));
}

gulp.task('copy:images', copyTask('./Client/img/*', './wwwroot/img'));
gulp.task('copy:css', copyTask('./Client/css/*', './wwwroot/css'));
gulp.task('copy:html', copyTask('./Client/index.html', './wwwroot'));

gulp.task('prod', ['copy:css', 'copy:images', 'copy:html', 'copy:libs'])
