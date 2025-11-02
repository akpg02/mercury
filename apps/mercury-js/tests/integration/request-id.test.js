const request = require('supertest');

function reload(modulePath) {
  delete require.cache[require.resolve(modulePath)];
  return require(modulePath);
}

describe('requrest id (JS)', () => {
  it('adds x-request-id header to every response', async () => {
    const { buildApp } = reload('../../src/app.js');
    const app = buildApp();

    // simple test-only route
    app.get('/ping', async () => ({ ok: true }));

    const res = await request(app.server).get('/ping');
    const rid = res.headers['x-request-id'];

    expect(typeof rid).toBe('string');
    expect(rid).toBeTruthy(); // non-empty
  });

  it('preserves incoming x-request-id', async () => {
    const { buildApp } = reload('../../src/app.js');
    const app = buildApp();

    app.get('/pong', async () => ({ ok: true }));

    const incoming = 'abc-123-custom-id';
    const res = await request(app.server)
      .get('/pong')
      .set('x-request-id', incoming);

    expect(res.headers['x-request-id']).toBe(incoming);
  });
});
