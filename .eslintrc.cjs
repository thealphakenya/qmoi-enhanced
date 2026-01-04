module.exports = {
  // Temporary global env settings to reduce `no-undef` noise during triage.
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  rules: {
    // Turn off `no-undef` during automated triage; TypeScript handles undefined globals.
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
        // tests often reference globals; allow them during triage
      },
    },
  ],
};
