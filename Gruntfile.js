module.exports = function (grunt) {

    'use strict';

    // Register various packages/tasks we're going to use
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-modernizr');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-sass');


    // Project configuration.
    grunt.initConfig({
        pkg: require('./package'),


        sass: {
            dev: {
                options:{
                    sourcemap: "auto",
                },
                files: {
                   'css/main.css': 'css/main.scss',
                }
            }
        },

        //compress(uglify) require.js itself
        // uglify: {
        //     requirejs: {
        //         files: {
        //             'public_html/js/require.min.js': ['public_html/vendor/requirejs/require.js']
        //         }
        //     }
        // },

        // concat: {
        //     options: {
        //         separator: ';',
        //     },
        //     deploy: {
        //         src: ['public_html/js/require.min.js', 'public_html/js/init.min.js'],
        //         dest: 'public_html/js/all.min.js',
        //     },
        // },

        //Build modernizr
        modernizr: {
            devFile: 'vendor/modernizr/modernizr.js',
            outputFile : 'js/modernizr.min.js',

            extra: {
                shiv: true,
                mq: true,
                svg: true
            },

            // Minify
            uglify: true,

            // Files
            files: ['js/main.js', 'app/less/**/*.less']
        },

        // jshint: {
        //     all: [
        //         'Gruntfile.js',
        //         'public_html/js/init.js',
        //         'public_html/js/app/*.js'

        //     ],
        //     options: {
        //         jshintrc: '.jshintrc'
        //     }
        // },

        less: {
            dev: {
                options: {
                    //paths: ["/css"]
                    //dumpLineNumbers: 'all',
                    sourceMap: true,
                    relativeUrls: true,
                },
                files: {
                    'css/main.css': 'css/main.less',
                }
            }
            //,
            // deploy: {
            //     options: {
            //         //paths: ["assets/css"],
            //         yuicompress: true,
            //         relativeUrls: true
            //     },
            //     files: {
            //         'css/main.css': 'css/main.less',
            //     }
            // }
        },

        watch: {
            sass: {
                files: ['css/**/*.scss'],
                tasks: 'sass:dev'
            },
            js: {
                files: [
                    'Gruntfile.js',
                    'js/*.js'
                ],
                //tasks: 'jshint'
            },
            livereload: {
                options: { livereload: true },
                files: ['js/**/*.js','css/**/*.css','index.html' ]
            }
        },

    });

    //grunt.registerTask('deploy', ['jshint', 'less:deploy', 'requirejs', 'modernizr', 'uglify:requirejs', 'concat:deploy']);

    grunt.registerTask('default', ['sass:dev']);


};



