import appConfig from './config.js';
import common    from './webpack.common.js';

const {serverPort} = appConfig;

export default {
  ...common,
  mode: 'development',

  devServer: {
    compress:   true,
    hot:        true,
    liveReload: false,
    port:       serverPort + 1,
//    proxy: {
//      '/api': {
//        target: `https://${host}:${appConfig.serverPort}`,
//        secure: false,
//      },
//    },
  },
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
