module.exports = function (grunt)
{
	require('load-grunt-tasks')(grunt);
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/* $linq Version <%= pkg.version %> (by Kurtis Jones @ <%= pkg.homepage %>) */'
			},
			build: {
				src: 'jslinq.js',
				dest: 'jslinq.min.js'
			}
		},
		karma: {
			unit: {
				options: {
					frameworks: ['jasmine'],
					files: ['jquery-1.8.0.min.js', 'jslinq.js', 'spec/jslinqSpec.js'],
					plugins: ['karma-chrome-launcher', 'karma-jasmine', 'karma-phantomjs-launcher']
				},
				singleRun: true,
				browsers: ['PhantomJS']
			},
			unitMin: {
				options: {
					frameworks: ['jasmine'],
					files: ['jquery-1.8.0.min.js', 'jslinq.min.js', 'spec/jslinqSpec.js'],
					plugins: ['karma-chrome-launcher', 'karma-jasmine', 'karma-phantomjs-launcher']
				},
				singleRun: true,
				browsers: ['PhantomJS']
			}
		}
	});
	
	grunt.registerTask('default', ['uglify']);
	grunt.registerTask('test', ['karma:unit', 'uglify', 'karma:unitMin']);
};