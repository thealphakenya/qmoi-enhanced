<!-- AUTODEV Enhanced: 2026-04-20T09:07:44.947561 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:11.880175 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:08.990496 -->
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: { node: "current" },
      },
    ],
    ["@babel/preset-react", { runtime: "automatic" }],
    "@babel/preset-typescript",
  ],
  plugins: [],
};
