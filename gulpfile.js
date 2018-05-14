//require gulp modules
var gulp = require('gulp'),
	changed = require('gulp-changed'),
	debug = require('gulp-debug'),
	path = require('path'),
	merge = require('merge-stream');


var jshint = require('gulp-jshint');

gulp.task('lint', function () {
	return gulp.src('./src/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

//Watch task: calls the linting task
gulp.task('watch', function () {
	gulp.watch('./src/*.js', ['lint']);
});

gulp.task('default', ['watch']);
