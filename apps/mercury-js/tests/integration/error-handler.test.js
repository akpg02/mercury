const request = require('supertest');
const { buildApp } = require('../../src/app');

let app;

beforeEach(async () => {
  // fresh app per test to avoid route pollution
  app = buildApp();
  // ensure routes/hooks are registered
  await app.ready();
});

afterEach(async () => {
  // clean up resources
  await app.close();
});

describe('global error handler (JS)', () => {
  it('maps known app error to 400 BAD_REQUEST with safe payload', async () => {
    // temporary route for the test
    app.get('/boom-known', async () => {
      // We don't have real classes yet; simulate by name.
      const err = new Error('bad input');
      err.name = 'BadRequestError';
      throw err;
    });

    const res = await request(app.server).get('/boom-known');

    expect(res.statusCode).toBe(400);
    // Standard error contract; stable keys, UPPER_SNAKE error code
    expect(res.body).toEqual(
      expect.objectContaining({
        error: 'BAD_REQUEST',
        message: expect.any(String),
      }),
    );
    // No stack leaks:
    expect(JSON.stringify(res.body)).not.toMatch(/stack/i);
    // Content type is JSON:
    expect(res.headers['content-type']).toMatch(/application\/json/i);
  });

  it('maps unknown errors to 500 INTERNAL_SERVER_ERROR without stack leak', async () => {
    app.get('/boom-unknown', async () => {
      throw new Error('kaboom');
    });

    const res = await request(app.server).get('/boom-unknown');

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual(
      expect.objectContaining({
        error: 'INTERNAL_SERVER_ERROR',
        // Keep message stable and safe (we assert string, not exact text)
        message: expect.any(String),
      }),
    );
    expect(JSON.stringify(res.body)).not.toMatch(/stack/i);
  });

  it('maps validation error to 400 BAD_REQUEST', async () => {
    app.get('/boom-validate', async () => {
      const err = new Error('invalid payload');
      err.name = 'ValidationError'; // the handler will treat this as 400
      throw err;
    });

    const res = await request(app.server).get('/boom-validate');

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(
      expect.objectContaining({
        error: 'BAD_REQUEST',
        message: expect.any(String),
      }),
    );
  });
});
