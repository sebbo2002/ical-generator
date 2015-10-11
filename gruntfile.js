module.exports = function(grunt) {
    'use strict';

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.initConfig({
        clean: {
            coverage: ['coverage/**']
        },
        jshint: {
            options: {
                jshintrc: true
            },
            lib: [
                'lib/*.js',
                'test/*.js'
            ]
        },
        watch: {
            lib: {
                files: ['lib/*.js', 'test/*.js'],
                tasks: ['jshint:lib']
            }
        }
    });

    grunt.registerTask('default', ['jshint:lib']);
    grunt.registerTask('dev', ['jshint:lib', 'watch']);
};