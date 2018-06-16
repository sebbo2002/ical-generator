const webpack = require('webpack');

const config = {
    entry: {
        'ical-generator': __dirname + '/src/index.js'
    },
    mode: 'production',
    devtool: 'source-map',
    output: {
        path: __dirname + '/lib',
        filename: '[name].js',
        library: 'ical-generator',
        libraryTarget: 'umd',
        umdNamedDefine: true
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