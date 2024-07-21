import eslintConfig from '@stheine/helpers/eslint.config';

export default [
  ...eslintConfig,

  {
    ignores: [
      'dist/',
      'node_modules/*',
      '*.md',
      '*.scss',
      '*.swp',
    ],
  },
];
