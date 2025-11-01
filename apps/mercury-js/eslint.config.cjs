const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  // Ignore build artifacts
  { ignores: ['dist/', 'coverage/', 'node_modules/'] },

  // JS source files
  {
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
