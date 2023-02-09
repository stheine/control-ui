import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack           from 'webpack';

export default {
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
        use: [{
          loader: 'babel-loader',
          options: {
// dev-only:  plugins: ['react-refresh/babel'],

            // This is a feature of `babel-loader` for webpack (not Babel itself).
            // It enables caching results in ./node_modules/.cache/babel-loader/
            // directory for faster rebuilds.
            cacheDirectory:   true,
            cacheCompression: false,
            compact:          true,
          },
        }],
      },
      {
        test:    /\.scss$/,
        use:    ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'}),
    new webpack.ProvidePlugin({
      Buffer:  ['buffer', 'Buffer'],
      process: ['process'],
      url:     ['url'],
    }),
  ],
};
