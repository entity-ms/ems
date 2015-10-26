/**
 * @todo
 */

/**
 * Exports the Grunt config runner.
 */
module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    /**
     * Provides the clean task options.
     */
    clean: {
      dest: [
        './docs',
        './coverage'
      ],
    },

    /**
     * Provides the Mocha task options.
     */
    simplemocha: {
      dist: {
        src: [
          './tests/**/*.test.js',
          './components/**/tests/*.test.js',
          './components/**/tests/**/*.test.js',
          './packages/**/tests/*.test.js',
          './packages/**/tests/**/*.test.js'
        ]
      }
    },
    mocha_istanbul: {
      coverage: {
        src: [
          './tests/**/*.test.js',
          './components/**/tests/*.test.js',
          './components/**/tests/**/*.test.js',
          './packages/**/tests/*.test.js',
          './packages/**/tests/**/*.test.js'
        ]
      }
    },

    /**
     * Provides the jsHint task options.
     */
    jshint: {
      files: [
        'index.js',
        'lib/**/*.js',
        'components/**/lib/**/*.js'
      ],
      options: {
        reporter: require('jshint-stylish'),
        jshintrc: true
      }
    },

    /**
     * Provides the esLint task options.
     */
    eslint: {
      files: ['<%= jshint.files %>']
    },

    /**
     * Provides the YUIDoc task options.
     */
    yuidoc: {
      dest: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        options: {
          themedir: './node_modules/yuidoc-bootstrap-theme',
          helpers: [
            './node_modules/yuidoc-bootstrap-theme/helpers/helpers.js'
          ],
          linkNatives: true,
          attributesEmit: true,
          selleck: true,
          outdir: './docs',
          paths: ['./'],
          ignorePaths: [
            'node_modules', 'mongodb-data', 'docs', 'config'
          ],
          exclude: '*.test.js'
        }
      }
    },

    /**
     * Provides the Watch task options.
     */
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'eslint']
    }
  });

  require('load-grunt-tasks')(grunt);

  // Registers the 'test' task.
  grunt.registerTask('test', [
    'jshint', 'eslint',
    'clean', 'simplemocha', 'mocha_istanbul'
  ]);

  // Defines the default task.
  grunt.registerTask('default', [
    'jshint', 'eslint',
    'clean',
    'simplemocha', 'mocha_istanbul',
    'yuidoc'
  ]);
};
