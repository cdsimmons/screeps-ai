// I think I can only unit test... I don't have the source code of the game, so can't feasibly e2e test... or maybe I could partly...
// Tried to add in coverage, but since I'm not using babel it didn't seem worth adding 4 other node packages just to see this metric

var webpack = require('webpack');
var webpackConfig = require('./webpack.config');
var testGlob = 'test/**/*.test.js';
var srcGlob = 'src/main.js';

// Other ways to pass in env variable into webpack2, but this works
webpackConfig.plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('test')
        }
    })
]

// Karma config...
module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],


    // list of files / patterns to load in the browser
    files: [testGlob],


    // list of files to exclude
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        [testGlob]: ['webpack'],
        //[srcGlob]: ['webpack', 'coverage']
    },

    // Webpack config...
    webpack: webpackConfig,
    webpackMiddleware: {
        noInfo: true
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],
    // coverageReporter: {
    //     dir : 'test/coverage/',
    //     reporters: [
    //         {type: 'lcov', subdir: '.'},
    //         {type: 'json', subdir: '.'},
    //         {type: 'text-summary'}
    //     ]
    // },

    // Add the console.log to terminal
    browserConsoleLogOptions: {
        level: 'log',
        format: '%T: %m',
        terminal: true
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
