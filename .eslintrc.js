'use strict';

const common = require('./.eslintrc.common.js');

module.exports = {
  extends: [
    'es/node',
//    'eslint:recommended',
    'plugin:json/recommended',
    'plugin:react/recommended',
  ],

  ...common,
};
