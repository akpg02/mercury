// apps/mercury-js/.eslintrc.cjs
module.exports = {
  root: true,
  env: { node: true, es2022: true }, // bump to es2022 so modern class/fields parse
  parserOptions: { ecmaVersion: 2022, sourceType: 'commonjs' },
  extends: ['eslint:recommended'],
  ignorePatterns: ['dist', 'coverage', 'node_modules'],
  overrides: [
    {
      files: ['tests/**/*.js'],
      // Declare test globals (Vitest/Jest-style) so no-undef stops firing
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
      // It’s common to leave empty hooks/blocks in tests — relax that here
      rules: { 'no-empty': 'off' },
    },
  ],
};
