const { toHttp } = require('../../src/lib/errors');
const { HTTP } = require('../../src/lib/http');

describe('toHttp', () => {
  it('maps name=BadRequestError to 400 BAD_REQUEST', () => {
    const e = new Error('bad');
    e.name = 'BadRequestError';
    const out = toHttp(e);
    expect(out.status).toBe(HTTP.BAD_REQUEST);
    expect(out.body.error).toBe('BAD_REQUEST');
  });

  it('maps unknown to 500 INTERNAL_SERVER_ERROR', () => {
    const out = toHttp(new Error('boom'));
    expect(out.status).toBe(HTTP.INTERNAL_SERVER_ERROR);
    expect(out.body.error).toBe('INTERNAL_SERVER_ERROR');
  });
});
