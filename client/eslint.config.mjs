import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Custom overrides for this Next.js + Firebase project
  {
    rules: {
      // Firebase/Firestore requires dynamic typing — disable strict any check
      "@typescript-eslint/no-explicit-any": "off",
      // Unused vars: warn only (don't block builds)
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      // Setting state in effects is valid for pagination / resets
      "react-hooks/set-state-in-effect": "off",
      // Allow unescaped entities in JSX (common in French text)
      "react/no-unescaped-entities": "off",
    },
  },
]);

export default eslintConfig;
