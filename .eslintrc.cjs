module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
    browser: true
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  extends: ['eslint:recommended'],
  rules: {
    'no-console': 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-undef': 'error'
  },
};
