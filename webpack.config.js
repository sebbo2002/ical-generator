const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

const config = {
    entry: {
        'ical-generator': __dirname + '/src/index.js'
    },
    devtool: 'source-map',
    output: {
        path: __dirname + '/lib',
        filename: '[name].js',
        library: 'ical-generator',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        loaders: [
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
    plugins: [
        new UglifyJsPlugin({ minimize: true })
    ],
    resolve: {
        extensions: ['.js']
    }
};

module.exports = config;