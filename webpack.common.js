// const path = require('path');

import HtmlWebpackPlugin from 'html-webpack-plugin';
// const webpack = require('webpack'); //to access built-in plugins

export default {
//  entry:  './src/index.js',
  entry:  './src/index.jsx',
//  output: {
//    path: path.join(__dirname, 'build'),
//  },
  module: {
    rules: [
//      {test: /\.html$/, use: 'html-loader'},
      {
        test:    /\.jsx$/,
        exclude: /node_modules/,
        use:    'babel-loader',
      },
      {
        test:    /\.scss$/,
        use:    ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'}),
  ],

//  additionalJsxSources: [
//    path.join(process.cwd(), 'node_modules/.../'),
//  ],
};
