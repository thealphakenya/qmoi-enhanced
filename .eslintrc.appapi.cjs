module.exports = {
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
      },
    },
  ],
};
