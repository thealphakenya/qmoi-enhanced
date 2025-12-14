export default function (api) {
  api.cache(true);
  return {
    presets: ["next/babel", "@babel/preset-react"],
    plugins: ["@babel/plugin-syntax-jsx"],
  };
}
