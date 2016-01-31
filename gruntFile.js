module.exports = function(grunt){

  // Load grunt plugins
  [
    'grunt-cafe-mocha',
    'grunt-contrib-jshint',
    'grunt-exec',
    'grunt-contrib-less',
    'grunt-contrib-uglify',
    'grunt-contrib-cssmin',
    'grunt-hashres',
    'grunt-lint-pattern',
  ].forEach(function(task){
    grunt.loadNpmTasks(task);
  });

  // Configure grunt plugins
  grunt.initConfig({
    cafemocha: {
      all: { src: 'qa/tests-*.js', options: { ui: 'tdd' }, }
    },
    jshint: {
      app: ['meadowlark.js', 'public/js/**/*.js', 'lib/**/*.js'],
      qa: ['Gruntfile.js', 'public/qa/**/*.js', 'qa/**/*.js'],
    },
    exec: {
      linkchecker: { cmd: 'linkchecker --ignore-url=\'!^(https?:)\/\/localhost\b\' --ignore-url=/cart/add --no-warnings                            http://localhost:3000' }
    },
    // Less engine tasks
    less: {
      development: {
        options: {
          customFunctions: {
            // Static resources mapper function
            static: function(lessObject, name) {
              return 'url("' + require('./app/lib/static.js').map(name.value) + '")';
            }
          }
        },
        // Compile CSS files from less files
        files: {
          'public/css/main.css': 'app/less/main.less',
          'public/css/cart.css': 'app/less/cart.less',
        }
      }
    },
    // Javascript bundler and minifier
    uglify: {
      all: {
        files: {
          // Compress all client javascript in a single minified file
          'public/js/meadowlark.min.js': ['public/js/**/*.js']: ['public/js/**/*.js']
        }
      }
    },
    // Combine multiple css file in a single file and minify it
    cssmin: {
      combine: {
        files: {
          // Avoid including css files generated my minification
          'public/css/meadowlark.css': ['public/css/**/*.css','!public/css/meadowlark*.css']
        }
      },
      minify: {
        src: 'public/css/meadowlark.css',
        dest: 'public/css/meadowlark.min.css',
      },
    // Handles the versions of the minified css and js files
    hashres: {
      options: {
        fileNameFormat: '${name}.${hash}.${ext}'
      },
      all: {
        src: [
          'public/js/meadowlark.min.js',
          'public/css/meadowlark.min.css',
        ],
        dest: [
          'config.js',
        ]
      },
    },
    lint_pattern: {
      view_statics: {
        options: {
          rules: [
            {
              pattern: /<link [^>]*href=["'](?!\{\{|(https?:)?\/\/)/,
              message: 'Un-mapped static resource found in <link>.'
            },
            {
              pattern: /<script [^>]*src=["'](?!\{\{|(https?:)?\/\/)/,
              message: 'Un-mapped static resource found in <script>.'
            },
            {
              pattern: /<img [^>]*src=["'](?!\{\{|(https?:)?\/\/)/,
              message: 'Un-mapped static resource found in <img>.'
            },
          ]
        },
        files: {
          src: [ 'views/**/*.handlebars' ]
        }
      },
      css_statics: {
        options: {
          rules: [
            {
              pattern: /url\(/,
              message: 'Un-mapped static found in LESS property.'
            },
          ]
        },
        files: {
          src: [
            'less/**/*.less'
          ]
        }
      }
    }
  });	

  // register tasks
  grunt.registerTask('default', ['cafemocha','jshint','exec', 'lint_pattern']);
  grunt.registerTask('static', ['less', 'cssmin', 'uglify', 'hashres']);
};
