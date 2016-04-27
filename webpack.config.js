var webpack = require('webpack'),
    path = require('path'),
    yargs = require('yargs');

var libraryName = 'ApiAi',
    plugins = [],
    outputFile;

if (yargs.argv.m || yargs.argv.minify) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));
    outputFile = libraryName + '.min.js';
} else {
    outputFile = libraryName + '.js';
}

module.exports = {

    entry: [
        path.join(__dirname, 'src', 'Client.ts')
    ],
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, 'target'),
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'var'
    },
    
    module: {
        loaders: [
            { test: /\.tsx?$/, loader:"ts-loader", exclude: /node_modules/ }
        ]
    },
    
    resolve: {
        root: path.resolve('./src'),
        extensions: [ '', '.js', '.ts', '.jsx', '.tsx' ]
    },

    plugins: plugins
};