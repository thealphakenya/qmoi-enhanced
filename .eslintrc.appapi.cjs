<!-- AUTODEV Enhanced: 2026-04-20T09:06:57.616247 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:06.903059 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:02.604000 -->
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
