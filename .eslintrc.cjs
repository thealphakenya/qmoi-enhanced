module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'no-undef': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^(?:_|req|res|next|params|query|options|error|err|metrics|discussion|data|filters|hf|local|tags)$',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
  },
  overrides: [
    {
      files: ['app/api/**/*.{ts,tsx,js,jsx}'],
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'no-redeclare': 'off',
        '@typescript-eslint/no-empty-function': 'off',
      },
    },
    {
      files: ['**/*.test.ts', '**/*.test.tsx', 'tests/**/*.{js,ts,tsx}'],
      env: {
        jest: true,
        node: true,
        browser: true,
      },
      rules: {},
    },
    {
      files: ['*.cjs', '*.js'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
};
