/** @type {import('vitest').UserConfig} */
module.exports = {
  test: {
    environment: "node",
    include: ["tests/**/*.{test,spec}.ts"],
    coverage: { reporter: ["text", "html"] },
  },
};
