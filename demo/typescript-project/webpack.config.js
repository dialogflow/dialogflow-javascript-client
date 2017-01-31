"use strict";

const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: [
        path.join(__dirname, 'src', 'index.ts')
    ],
    output: {
        path: path.join(__dirname, 'deploy'),
        publicPath: "/deploy",
        filename: 'index.js'
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: true
            },
            output: {
                comments: false
            },
            sourceMap: false
        })
    ],
    module: {
        loaders: [
            {test: /\.tsx?$/, loader: "awesome-typescript-loader"}
        ]
    },
    resolve: {
        modules: [
            'node_modules',
            path.resolve(__dirname, 'app')
        ],
        extensions: ['.ts', '.js']
    },
    devServer: {
        port: 8000
    }
};
