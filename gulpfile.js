// I really didn't want to use gulp, but I need to do some file injection, copying, and watching...
// To do all this (and remain OS agnostic), gulp is the simplest solution really...
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var webpackStream = require('webpack-stream');
var webpack2 = require('webpack');
var inject = require('gulp-inject-string');
var git = require('git-rev');

var root = 'src';
//var game = 'C:/Users/Carl/AppData/Local/Screeps/scripts/screeps.com'; // Location of the game assets...

// Map all paths
var paths = {
	entry: root + '/main.js',
	src: root + '/**/*.js',
	output: 'dist',
	game: 'C:/Users/Carl/AppData/Local/Screeps/scripts/screeps.com'
}

// Bundle up with webpack
gulp.task('compile', function() {
	return gulp.src(paths.entry)
		.pipe(plumber())
		.pipe(webpackStream(require('./webpack.config'), webpack2))
		.pipe(inject.append('\nmodule.exports.loop = main.loop;'))
    	.pipe(gulp.dest(paths.output));
});

// We copy the file into a folder with the name set to current branch...
// Bit of a simple way to manage distribution and helps force us to work with the right branches...
// Obviously for a more important project, things would not be done this way
gulp.task('distribute', ['compile'], function() {
	// This might be breaking stream... since git.branch is not really a gulp thing
	return git.branch(function (str) {
		return gulp.src(paths.output + '/**/*.js')
			.pipe(plumber())
	    	.pipe(gulp.dest(paths.game + '/' + str));
	});
});

// Watch for changes
gulp.task('watch', ['build'], function() {
	gulp.watch([paths.src], ['build']);
});

// Our usual build task...
gulp.task('build', ['compile', 'distribute']);

// Cover default
gulp.task('default', ['build']);