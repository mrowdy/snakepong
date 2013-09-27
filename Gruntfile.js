module.exports = function(grunt) {

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
            compile: {
                options: {
                    baseUrl: 'src',
                    name: 'main',
                    out: 'build/snakepong.min.js',
                    removeCombined: false
                }
            }
        },
        usebanner: {
            compile: {
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
            compile: {
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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-banner');
    grunt.registerTask('default', ['requirejs', 'sass', 'usebanner']);
};