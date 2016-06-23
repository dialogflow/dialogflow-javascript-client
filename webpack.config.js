var webpack = require('webpack'),
    path = require('path'),
    yargs = require('yargs');

var libraryName = 'ApiAi',
    plugins = [],
    outputFile = '';

var libraryTarget = 'var';


if (yargs.argv.m || yargs.argv.minify) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));
    outputFile += libraryName + '.min';
} else {

    outputFile += libraryName; //+ '.js';
}


if (yargs.argv.target || yargs.argv.t) {
    libraryTarget = yargs.argv.t || yargs.argv.target;
    outputFile += '.' + libraryTarget;
}

outputFile += '.js';


module.exports = {

    entry: [
        path.join(__dirname, 'src', 'Client.ts')
    ],
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, 'target'),
        filename: outputFile,
        library: libraryName,
        libraryTarget: libraryTarget
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