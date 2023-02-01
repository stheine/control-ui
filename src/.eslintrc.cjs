const common = require('../.eslintrc.common.cjs');

module.exports = {
  ...common,

  parser: '@babel/eslint-parser',

  parserOptions: {
    requireConfigFile: false,
    sourceType: 'module',
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
  },

//  extends: [
//    'es/node',
//    'eslint:recommended',
//    'plugin:react/recommended',
//  ],

  globals: {
    React:   true,
//    document: true,
  },

  plugins: [
//    'html',
    'react',
  ],
};
