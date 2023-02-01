const common = require('./.eslintrc.common.cjs');

module.exports = {
  extends: [
    'es/node',
//    'eslint:recommended',
//    'plugin:json/recommended',
//    'plugin:react/recommended',
  ],

  parserOptions: {
    sourceType: 'module',
  },

  ...common,
};
