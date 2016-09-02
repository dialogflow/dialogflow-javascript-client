"use strict";

const webpack = require('webpack'),
    path = require('path');

let libraryName = 'ApiAi',
    libraryTarget = 'var',
    outputFile = '',
    sourceMaps = true,
    plugins = [];


module.exports = function(env) {

    // handle minification
    if (env.compress === 'true') {
        plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));
        outputFile += libraryName + '.min';
        sourceMaps = false;
    } else {
        outputFile += libraryName;
    }

    // handle custom target
    if (env.target) {
        libraryTarget = env.target;
        outputFile += '.' + libraryTarget;
    }

    outputFile += '.js';

    return {
        entry: [
            path.join(__dirname, 'src', 'Client.ts')
        ],
        devtool: sourceMaps ? 'source-map' : null,
        output: {
            path: path.join(__dirname, 'target'),
            filename: outputFile,
            library: libraryName,
            libraryTarget: libraryTarget
        },

        module: {
            loaders: [
                {test: /\.tsx?$/, loader: "ts-loader", exclude: /node_modules/}
            ]
        },

        resolve: {
            root: path.resolve('./src'),
            extensions: ['', '.js', '.ts', '.jsx', '.tsx']
        },

        plugins: plugins
    }
};