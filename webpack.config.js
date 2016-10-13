"use strict";

const webpack = require('webpack');
const path = require('path');

let libraryName = 'ApiAi';
let libraryTarget = 'var';
let outputFile = libraryName;
let sourceMaps = true;
let plugins = [];
let alias = {};
// let ignoreLoader = {};

module.exports = function(env) {
  if (!env) {
    env = {};
  }
  if (env && env.skipStreamClient) {
    outputFile += '.streamless';
    /*  ignoreLoader = {
     test: /Stream/,
     loader: 'webpack-replace-module-loader',
     include: './src/Stream/StubStreamClient'
     };
     */
    // alias["StreamClient"] = "StubStreamClient";
  }

  // handle minification
  if (env && env.compress === 'true') {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        keep_fnames: true
      },
      mangle: {
        keep_fnames: true
      }
    }));
    outputFile += '.min';
    sourceMaps = false;
  } else {
    // outputFile += libraryName;
  }

  // handle custom target
  if (env && env.target) {
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
        // ignoreLoader
      ]
    },

    resolve: {
      root: path.resolve('./src'),
      extensions: ['', '.js', '.ts', '.jsx', '.tsx'],
      alias: alias
    },

    plugins: plugins
  };
};
