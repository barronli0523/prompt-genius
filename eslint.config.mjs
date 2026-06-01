import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";

export default tseslint.config(
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    extends: [
      ...tseslint.configs.recommended,
    ],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.rules.recommended,
      ...nextPlugin.rules["core-web-vitals"],
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      ".vercel/**",
      ".wrangler/**",
      "node_modules/**",
      "*.config.*",
      "next-env.d.ts",
    ],
  }
);
