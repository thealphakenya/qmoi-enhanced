// scripts/validate-tailwind-config.js
const fs = require('fs');
const path = require('path');

const tailwindConfigPath = path.resolve('tailwind.config.ts');
const globalsCssPath = path.resolve('app/globals.css');

// Auto-fix missing tailwind.config.ts
if (!fs.existsSync(tailwindConfigPath)) {
  console.log("⚠️  Missing tailwind.config.ts. Recreating...");
  fs.writeFileSync(tailwindConfigPath, `import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx,js,jsx,mdx}",
    "./components/**/*.{ts,tsx,js,jsx,mdx}",
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
    "./pages/**/*.{ts,tsx,js,jsx,mdx}",
    "./**/*.{ts,tsx,js,jsx,mdx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;`);
  console.log("✅ Recreated tailwind.config.ts");
}

// Auto-fix missing globals.css
if (!fs.existsSync(globalsCssPath)) {
  console.log("⚠️  Missing app/globals.css. Recreating...");
  fs.mkdirSync(path.dirname(globalsCssPath), { recursive: true });
  fs.writeFileSync(globalsCssPath, `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-white text-black;
}`);
  console.log("✅ Recreated app/globals.css");
}

console.log("✅ Tailwind config validated");
