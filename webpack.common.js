import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack           from 'webpack'; // to access built-in plugins

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
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: ['process'],
      url: ['url'],
    }),
  ],

//  resolve: {
//    fallback: {
//      url:    require.resolve('url'),
//    },
//  },

//  additionalJsxSources: [
//    path.join(process.cwd(), 'node_modules/.../'),
//  ],
};
