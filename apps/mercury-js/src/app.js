const Fastify = require('fastify');
const { loadConfig } = require('./lib/config');

function buildApp() {
  const app = Fastify({ logger: false });
  const cfg = loadConfig();
  app.decorate('config', cfg);

  app.get('/health', async () => ({
    status: 'ok',
    uptime: process.uptime(),
    version: process.env.npm_package_version || '0.0.0',
  }));

  return app;
}

module.exports = { buildApp };
