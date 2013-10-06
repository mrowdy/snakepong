module.exports = function(grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/**\n' +
            '* <%= pkg.name %>\n' +
            '* version: <%= pkg.version %>\n' +
            '* date: <%= grunt.template.today("dd-mm-yyyy") %>\n' +
            '*\n' +
            '* ©<%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
            '* <%= pkg.author.email %> \n' +
            '*\n' +
            '* License: GNU GENERAL PUBLIC LICENSE v2\n' +
            '*/',

        requirejs: {
            build: {
                options: {
                    baseUrl: 'src',
                    name: 'main',
                    out: 'build/snakepong.min.js',
                    removeCombined: false
                }
            }
        },
        usebanner: {
            build: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>'
                },
                files: {
                    src: [ 'build/snakepong.min.js' ]
                }
            }
        },
        sass: {
            build: {
                options: {
                    loadPath: 'sass',
                    style: 'compressed',
                    cacheLocation: 'cache/sass',
                    banner: '<%= banner %>'
                },
                files: {
                    'build/snakepong.min.css': 'sass/main.scss'
                }
            }
        },
        jshint: {
            all: [
                'Gruntfile.js',
                'src/**/*.js',
                'spec/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        jasmine: {
            src : 'src/**/*.js',
            options : {
                specs : 'spec/**/*.js',
                template: require('grunt-template-jasmine-requirejs'),
                templateOptions: {
                    requireConfig: {
                        baseUrl: 'src'
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-banner');

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    grunt.registerTask('default', ['requirejs', 'sass', 'usebanner']);
    grunt.registerTask('test', ['jshint', 'jasmine']);
};