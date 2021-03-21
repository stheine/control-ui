'use strict';

const common = require('./webpack.common.js');

module.exports = {
  ...common,
  mode: 'development',

//  nodeModulesHmr: true,
//  devServer: {
//    disableHostCheck: true,
//    host,
//    https,
//    port,
//    proxy: {
//      '/api': {
//        target: `https://${host}:${appConfig.serverPort}`,
//        secure: false,
//      },
//    },
//  },
//  additionalJsxSources,
//  resolve: {
//    alias: {
//      'react-dom': '@hot-loader/react-dom',
//    },
//  },
//  devtool: 'eval',                         // Kind of fast, but useless code references
//  devtool: 'inline-cheap-source-map',
//  devtool: 'cheap-module-eval-source-map', // Not really fast, and code file only
//  devtool: 'source-map',                   // Slow but exact code location
//  cache: {
//    type: 'filesystem',
//
//    buildDependencies: {
//      config: [__filename],
//    },
//  },
//
//  snapshot: {
//    managedPaths: [],
//    immutablePaths: [],
//    buildDependencies: {
//      hash: true,
//      timestamp: true,
//    },
//    module: {
//      timestamp: true,
//    },
//    resolve: {
//      timestamp: true,
//    },
//    resolveBuildDependencies: {
//      hash: true,
//      timestamp: true,
//    },
//  },
};
