// Using grunt because whilst it's a bit more rigid when compared to gulp a lot of the screeps packages are made for grunt... also easier to manage and better for simple projects imo
(function () {
   'use strict';
}());
module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks 
 
    grunt.initConfig({
        // Making sure our ES6 is error free and tidy (ish :P)
        eslint: {
            options: {
                configFile: 'eslint.json',
                fix: false
            },
            target: ['./src/**/*.js'],
        },

        // Copy over the files from dist to the game folder... quicker than uploading but have to have game application running locally...
        copy: {
            main: {
                files: [
                    {
                        expand: true, 
                        flatten: true,
                        src: ['./dist/*.js'], 
                        dest: 'C:/Users/Carl/AppData/Local/Screeps/scripts/screeps.com/rebuild-2', 
                        filter: 'isFile'
                    }
                ],
            },
        },

        // Compile on change...
        watch: {
            scripts: {
                files: ['./src/**/*.js'],
                tasks: ['eslint', 'concat', 'copy'],
                options: {
                    spawn: false
                }
            }
        },

        // Simple way to include all the files into 1 (saving CPU)...
        concat: {
            options: {
                separator: '\n',
            },
            dist: {
                src: [
                    './src/config.js', 
                    './src/helpers/log.js', 
                    './src/helpers/*.js', 
                    './src/classes/*.js', 
                    './src/manager/manage.js', 
                    './src/manager/*.js', 
                    './src/main.js'
                ],
                dest: './dist/main.js'
            }
        },

        // Unit testing... we can only do unit testing... unless we setup a virtual version of the game? Run through a series of objects...
        mocha: {
            all: {
                src: ['tests/testrunner.html'],
            },
            options: {
                run: true
            }
        }

        // Looking into importing files for project using requirejs, but doesn't really fit the screeps framework which uses commonjs
        // requirejs: {
        //     compile: {
        //         options: {
        //             baseUrl: './',
        //             include: ['src/main.js'],
        //             out: 'dist/main.js',
        //             optimize: 'none',
        //         }
        //     }
        // },

        // Because of how Screeps fires off the loop, we can't seem to compile with commonjs whilst maintaining high CPU efficiency
        // 'commonjs-compiler': {
        //     main: {
        //         cwd         : 'src',                  // scripts path, optional
        //         compilerPath: '../',                  // compiler.jar location
        //         entryModule : 'main.js',
        //         output      : '../dist/main.js'         // output file location
        //     }
        // }

        // No uglyfying to help with debugging within Screeps... not like we're saving on KB anyway since it's a game not a website
    });
     
    grunt.registerTask('default', ['eslint', 'concat', 'copy', 'watch']);
};