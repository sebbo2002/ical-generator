const webpack = require('webpack');

const config = {
    entry: {
        'tests': __dirname + '/src/tests.js'
    },
    mode: 'production',
    devtool: 'source-map',
    output: {
        path: __dirname + '/test-result/browser-test',
        filename: '[name].js',
        library: 'ical-generator',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        globalObject: 'typeof self !== \'undefined\' ? self : this'
    },
    module: {
        rules: [
            {
                test: /(\.js)$/,
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components|test)/
            }
        ]
    },
    plugins: [
        new webpack.NormalModuleReplacementPlugin(
            /^moment-timezone/,
            'moment-timezone/builds/moment-timezone-with-data'
        )
    ],
    externals: {
        moment: 'moment',
        fs : 'fs',
        portfinder: 'portfinder'
    },
    resolve: {
        extensions: ['.js']
    }
};

module.exports = config;