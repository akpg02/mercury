/** @type {import('vitest').UserConfig} */
module.exports = {
  test: {
    environment: 'node',
    include: ['tests/**/*.{test,spec}.js'],
    setupFiles: ['tests/setup/env.js'],
    globals: true, //
    coverage: { reporter: ['text', 'html'] },
  },
};
