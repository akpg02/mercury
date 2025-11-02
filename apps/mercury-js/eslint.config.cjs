const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  // Ignore build artifacts
  { ignores: ['dist/', 'coverage/', 'node_modules/'] },

  // JS source files
  {
    root: true,
    env: { node: true, es2021: true },
    extends: ['eslint:recommended'],
    plugins: ['vitest'],
    ignorePatterns: ['dist', 'coverage'],
    overrides: [
      {
        files: ['tests/**/*.js', '**/*.test.js', '**/*.spec.js'],
        // Enable vitest rules + globals awareness for test files
        extends: ['plugin:vitest/recommended'],
        env: { 'vitest-globals/env': true },
      },
    ],
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },

  // Test files: allow Vitest globals like `describe`, `it`, `expect`
  {
    files: ['tests/**/*.{js,cjs,mjs}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.vitest,
      },
    },
  },
];
