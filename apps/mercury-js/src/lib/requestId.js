// src/lib/requestId.js
const { randomUUID } = require('node:crypto');

function requestIdHook(app) {
  app.addHook('onRequest', async (req, reply) => {
    const incoming = req.headers['x-request-id'];
    const id =
      typeof incoming === 'string' && incoming.trim() ? incoming : randomUUID();
    reply.header('x-request-id', id);
  });
}
module.exports = { requestIdHook };
