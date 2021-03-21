const common = require('../.eslintrc.common.js');

module.exports = {
  ...common,

  extends: [
//    'es/node',
    'eslint:recommended',
    'plugin:react/recommended',
  ],

  globals: {
//    React:   true,
    document: true,
  },

  plugins: [
    'html',
    'react',
  ],

  parser: 'babel-eslint',

  parserOptions: {
    sourceType: 'module',
  },
};
