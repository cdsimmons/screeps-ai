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
//var validationCode = 0;

server = new KarmaServer({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, function(exitCode) {
        done(exitCode);
    });

// Map all paths
var paths = {
	entry: root + '/main.js',
	src: root + '/**/*.js',
	dist: output + '/**/*.js',
	tests: test + '/**/*.test.js',
	game: 'C:/Users/Carl/AppData/Local/Screeps/scripts/screeps.com' // Location of the game assets...
}

// Check the code
gulp.task('lint', function(done) {
	return gulp.src(paths.entry)
		.pipe(eslint({
			"rules":{
		        "camelcase": 1,
		        "comma-dangle": 2,
		        "quotes": 0
		    },
	        globals: [
	            '_'
	        ],
	        envs: [
	            'browser'
	        ]
	    }))
	    .pipe(eslint.format())
	    .pipe(eslint.failAfterError());
});

// Bundle up with webpack
gulp.task('compile', ['lint'], function(done) {
	return gulp.src(paths.entry)
		.pipe(plumber())
		.pipe(webpackStream(require('./webpack.config'), webpack2))
		.pipe(inject.append('\nmodule.exports.loop = main.loop;'))
    	.pipe(gulp.dest(output));
});

// Single run of the tests...
gulp.task('test', function(done) {
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

        // Kind of annoyed by the error log, but if I don't do this, then it'll just continue on or pause and stop watching
        done(exitCode);

        // Have a small issue now... if watching, tests fail, but we're still marking as done...
    }).start();
});

// We copy the file into a folder with the name set to current branch...
// Bit of a simple way to manage distribution and helps force us to work with the right branches...
// Obviously for a more important project, things would not be done this way
gulp.task('distribute', ['test'], function(done) {
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
gulp.task('watch', ['compile'], function() {
	watching = true;

	// Watch for source to compile it...
	gulp.watch([paths.src], ['compile']);
	// Watch for dist changes to distribute to game...
	gulp.watch([paths.dist], ['distribute']);
	// Watch for test file changes... tdd...
	gulp.watch([paths.tests], ['test']);

	// Trying to stop tests running twice... if watching, I want to use this for testing... maybe this should distribute after test or something...

	// I could do singleRun on test file change...

	// Tdd... watch for test updates and check against code...
	// if(!server) {
	//     server = new KarmaServer({
	//         configFile: __dirname + '/karma.conf.js',
	// 		singleRun: false,
	// 		autoWatch: true
	//     });
	// }

 //    server.start();
});

// Our usual build task...
gulp.task('build', ['compile', 'distribute']);

// Cover default
gulp.task('default', ['watch']);


// This setup is not ideal atm...
// Build no longer exits manually, I think karma is keeping it open
// Either I can let it break and thus stop the distribute call, or I can handle the error and it carries on... wut?
