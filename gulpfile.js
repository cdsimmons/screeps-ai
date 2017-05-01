// I really didn't want to use gulp, but I need to do some file injection, copying, and watching...
// To do all this (and remain OS agnostic), gulp is the simplest solution really...
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var inject = require('gulp-inject-string');
var eslint = require('gulp-eslint');
var webpackStream = require('webpack-stream');
var webpack2 = require('webpack');
var git = require('git-rev');
var KarmaServer = require('karma').Server;

var watching = false;
var root = 'src';
var output = 'dist';
var test = 'test';
var webpackConfig = require('./webpack.config');

// Map all paths
var paths = {
	entry: root + '/main.js',
	src: root + '/**/*.js',
	dist: output + '/**/*.js',
	tests: test + '/**/*.test.js',
	mockAndTests: test + '/**/*',
	game: 'C:/Users/Carl/AppData/Local/Screeps/scripts/screeps.com' // Location of the game assets...
}

// Check the code
gulp.task('lint', function(done) {
	return gulp.src([paths.src, paths.tests])
		.pipe(eslint({
			'rules':{
		        'camelcase': 1,
		        'comma-dangle': 2,
		        'quotes': 0
		    },
	        globals: ['_'],
	        envs: ['es6', 'browser']
	    }))
	    .pipe(eslint.format())
	    .pipe(eslint.failAfterError());
});

// Single run of the tests...
gulp.task('test', ['lint'], function(done) {
	// Overwrite environment var for webpack...
	webpackConfig.plugins = [
	    new webpack2.DefinePlugin({
	        'process.env': {
	            NODE_ENV: JSON.stringify('test')
	        }
	    })
	]

	// This is keeping node running...
	new KarmaServer({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, function(exitCode) {
        // If tests failed...
        if(exitCode !== 0) {
        	// Let us know
        	console.log('Tests failed');

        	// If not watching, exit process... has to be done otherwise Karma just keeps things alive
        	if(!watching) {
        		process.exit();
        	}
        }

        // Assumption is that master branch is live branch... we will stop distribution... for dev no need
		git.branch(function (str) {
	        if(str === 'master') {
	        	done(exitCode);
	        } else {
	        	done();
	        }
		});
    }).start();
});

// Bundle up with webpack
gulp.task('compile', ['test'], function(done) {
	// Overwrite environment var for webpack...
	// I can improve this... just like how gameStateStart is called as a function...
	// I keep forgetting that require is basically like injecting the JS straight in... 
	// I require the object atm, but I can make it a function which returns an object and call that...
	// If I do that, I can just pass an env variable! :D
	webpackConfig.plugins = [
	    new webpack2.DefinePlugin({
	        'process.env': {
	            NODE_ENV: JSON.stringify('production')
	        }
	    })
	]

	return gulp.src(paths.entry)
		.pipe(plumber())
		.pipe(webpackStream(webpackConfig, webpack2))
		.pipe(inject.append('\nmodule.exports.loop = main.loop;'))
    	.pipe(gulp.dest(output));
});

// We copy the file into a folder with the name set to current branch...
// Bit of a simple way to manage distribution and helps force us to work with the right branches...
// Obviously for a more important project, things would not be done this way
gulp.task('distribute', ['compile'], function(done) {
	// Not ending gulp task...
	git.branch(function (str) {
		gulp.src(paths.dist)
			.pipe(plumber())
	    	.pipe(gulp.dest(paths.game + '/' + str));

        done();

        // If tests pass we need to manually exit because of karma server...
        if(!watching) {
    		process.exit();
    	}
	});
});

// Watch for changes
gulp.task('watch', function() {
	watching = true;

	// Watch for source to compile it...
	gulp.watch([paths.src], ['distribute']);
	// Watch for test file changes... tdd...
	gulp.watch([paths.mockAndTests], ['test']);

	gulp.start('compile');
});

// Our usual build task...
gulp.task('build', ['compile', 'distribute']);

// Cover default
gulp.task('default', ['watch']);


// This setup is not ideal atm...
// Build no longer exits manually, I think karma is keeping it open
// Either I can let it break and thus stop the distribute call, or I can handle the error and it carries on... wut?
