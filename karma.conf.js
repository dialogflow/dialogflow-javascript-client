var webpackConfig = require('./webpack.config')({});

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai'],
    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      'spec/**/*.spec.ts'
    ],
    exclude: [],
    preprocessors: {
      'spec/**/*.spec.ts': ['webpack']
    },
    webpack: {
      module: webpackConfig.module,
      resolve: webpackConfig.resolve
    },
    phantomjsLauncher: {
      // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
      // exitOnResourceError: true,
      base: 'PhantomJS',
      flags: [
        '--web-security=false',
        '--load-images=true',
        '--ignore-ssl-errors=yes',
        '--ssl-protocol=any'
      ]
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false,
    concurrency: Infinity
  });
};
