module.exports = {
  // Global environment settings: TypeScript handles type checking for globals.
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  rules: {
    // enabled: TypeScript's type checking is sufficient for global validation.
    "no-undef": "off",
  },
  overrides: [
    {
      files: [
        "app/api/**/*.ts",
        "app/api/**/*.tsx",
        "app/api/**/*.js",
        "app/api/**/*.jsx",
      ],
      rules: {
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "no-redeclare": "off",
        "@typescript-eslint/no-empty-function": "off",
      },
    },
    {
      files: ["**/*.test.ts", "**/*.test.tsx", "tests/**/*.{js,ts,tsx}"],
      env: {
        jest: true,
        node: true,
        browser: true,
      },
      rules: {
        // Configured for test environment — globals are acceptable in test files.
      },
    },
  ],
};
