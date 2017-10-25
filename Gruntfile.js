module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-screeps');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
		screeps: {
			options: {
				email: 'twisted@twistopia.nl',
				password: 'Trusted',
				branch: 'default',
				ptr: false
			},
			dist: {
				src: ['Screeps/src/*.js']
			}
		}
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

};