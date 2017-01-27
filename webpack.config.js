"use strict";

const webpack = require('webpack');
const path = require('path');

let libraryName = 'ApiAi';
let libraryTarget = 'var';
let outputFile = libraryName;
let sourceMaps = true;
let plugins = [];
let entry = "_build.ts";

module.exports = function(env) {
  if (!env) {
    env = {};
  }
  if (env && env.streamless) {
    outputFile += '.streamless';
    entry = "_build.streamless.ts"
  }

  // handle minification
  if (env && env.compress) {
    plugins.push(
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      })
    );

    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: true,
          keep_fnames: true
        },
        mangle: {
          keep_fnames: true
        }
      })
    );
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
      path.join(__dirname, 'ts', entry)
    ],
    devtool: sourceMaps ? 'source-map' : false,
    output: {
      path: path.join(__dirname, 'target'),
      publicPath: "/target/",
      filename: outputFile,
      library: libraryName,
      libraryTarget: libraryTarget
    },

    module: {
      loaders: [
        {test: /\.tsx?$/, loader: "awesome-typescript-loader"}
      ]
    },
    resolve: {
      extensions: ['.js', '.ts']
    },
    plugins: plugins
  };
};
