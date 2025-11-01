const js = require("@eslint/js");
const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  // 1) Ignore build artifacts & local config files
  {
    ignores: [
      "dist/**",
      "coverage/**",
      "node_modules/**",
      "eslint.config.*",
      "vitest.config.*",
    ],
  },

  // 2) Base JS recommended rules
  js.configs.recommended,

  // 3) TypeScript files (CommonJS runtime)
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "commonjs",
      },
      // Mark Node globals so no-undef doesn't complain
      globals: {
        require: "readonly",
        module: "readonly",
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        console: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    // Start from TS recommended, then override a couple rules for CJS
    rules: {
      ...(tsPlugin.configs.recommended?.rules ?? {}),
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-var-requires": "off",
    },
  },

  // 4) Explicitly treat .cjs files as Node/CommonJS with the right globals
  {
    files: ["**/*.cjs"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        require: "readonly",
        module: "readonly",
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
      },
    },
    rules: {},
  },
];
