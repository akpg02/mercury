const Fastify = require('fastify');
const { loadConfig } = require('./lib/config');
const { toHttp } = require('./lib/errors');
const { requestIdHook } = require('./lib/requestId');

function buildApp() {
  const app = Fastify({ logger: false });

  // Load/validate env (throws on invalid)
  const cfg = loadConfig();
  app.decorate('config', cfg);

  // Request ID hook: must run on every request
  requestIdHook(app);

  // Global error handler: map to stable JSON
  app.setErrorHandler((err, _req, reply) => {
    const { status, body } = toHttp(err);
    reply.code(status).type('application/json').send(body);
  });

  app.get('/health', async () => ({
    status: 'ok',
    uptime: process.uptime(),
    version: process.env.npm_package_version || '0.0.0',
  }));

  return app;
}

module.exports = { buildApp };
