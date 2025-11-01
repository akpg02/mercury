const Fastify = require("fastify");

function buildApp() {
  const app = Fastify({ logger: false });

  app.get("/health", async () => ({
    status: "ok",
    uptime: process.uptime(),
    version: process.env.npm_package_version || "0.0.0",
  }));

  return app;
}

module.exports = { buildApp };
