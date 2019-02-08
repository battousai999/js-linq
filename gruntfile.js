module.exports = function (grunt)
{
    require('load-grunt-tasks')(grunt);
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        babel: {
            options: {
                presets: ['es2015'],
                plugins: ['transform-es2015-modules-amd']
            },
            build: {
                src: 'jslinq.js',
                dest: 'jslinq.amd.js'
            }
        },
        uglify: {
            options: {
                banner: '/* $linq Version <%= pkg.version %> (by Kurtis Jones @ <%= pkg.homepage %>) */'
            },
            build: {
                src: 'jslinq.js',
                dest: 'jslinq.min.js'
            },
            amd: {
                src: 'jslinq.amd.js',
                dest: 'jslinq.amd.min.js'
            }
        }
    });
    
    grunt.registerTask('default', ['uglify:build']);
    grunt.registerTask('uglify-both', ['babel', 'uglify']);
};