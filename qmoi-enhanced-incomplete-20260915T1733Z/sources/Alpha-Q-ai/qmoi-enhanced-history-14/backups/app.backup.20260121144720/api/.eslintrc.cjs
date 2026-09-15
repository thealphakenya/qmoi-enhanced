module.exports = {
  root: true,
  overrides: [
    {
      files: ["**/*.{ts,tsx,js,jsx}"],
      rules: {
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-explicit-any": "off",
      },
    },
  ],
};
