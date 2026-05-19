<!-- AUTODEV Enhanced: 2026-04-20T09:01:23.627837 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:17.790473 -->
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
