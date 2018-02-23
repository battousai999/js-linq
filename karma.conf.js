module.exports = function(config) {
    config.set({
        browsers: ['Chrome'],
        files: [
            { pattern: 'test-context.js', watched: false }
        ],
        frameworks: ['jasmine'],
        preprocessors: {
            'test-context.js': ['webpack']
        },
        webpack: {
            module: {
                loaders: [
                    { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?presets[]=es2015' }
                ]
            },
            watch: true
        },
        webpackServer: {
            noInfo: false
        }
    });
};