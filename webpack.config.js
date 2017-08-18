/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
"use strict";

const webpack = require('webpack');
const path = require('path');

let libraryName = 'ApiAi';
let libraryTarget = 'var';
let outputFile = libraryName;
let sourceMaps = true;
let plugins = [];
let entry = "ApiAiClient.ts";

module.exports = function(env) {
  if (!env) {
    env = {};
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
