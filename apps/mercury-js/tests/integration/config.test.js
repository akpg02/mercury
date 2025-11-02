const ORIGINAL_ENV = { ...process.env };

function baseEnv() {
  return {
    NODE_ENV: 'test',
    PORT: '3000',
    LOG_LEVEL: 'info',
    DATABASE_URL: 'postgres://user:pass@localhost:5432/mercury_test',
  };
}

function reload(modulePath) {
  const abs = require.resolve(modulePath);
  delete require.cache[abs];

  // also clear common nested modules if present
  const maybe = [
    abs.replace(/app\.js$/, 'lib/config.js'),
    abs.replace(/app\.js$/, 'lib/errors.js'),
  ];

  for (const m of maybe) {
    try {
      delete require.cache[require.resolve(m)];
    } catch {}
  }
  return require(modulePath);
}

function resetEnv(overrides = {}) {
  // remove keys set in baseEnv
  for (const k of ['NODE_ENV', 'PORT', 'LOG_LEVEL', 'DATABASE_URL']) {
    delete process.env[k];
  }
  // re-apply original and overrides
  Object.assign(process.env, ORIGINAL_ENV, overrides);
}

beforeEach(() => {
  // Start every test from a fresh, valid baseline
  process.env = { ...ORIGINAL_ENV, ...baseEnv() };
});

afterEach(() => {
  // Fully restore the original environment
  resetEnv();
});

describe('config validation (JS)', () => {
  it('throws if DATABASE_URL is missing', () => {
    delete process.env.DATABASE_URL;
    const { buildApp } = reload('../../src/app.js');
    expect(() => buildApp()).toThrow(/DATABASE_URL/i);
  });

  it('rejects non-numeric PORT', () => {
    process.env.PORT = 'abc';
    const { buildApp } = reload('../../src/app.js');
    expect(() => buildApp()).toThrow(/PORT/i);
  });

  it('rejects out-of-range PORT(0)', () => {
    process.env.PORT = '0';
    const { buildApp } = reload('../../src/app.js');
    expect(() => buildApp()).toThrow(/PORT/i);
  });

  it('reject out-of-range PORT(>65535)', () => {
    process.env.PORT = '70000';
    const { buildApp } = reload('../../src/app.js');
    expect(() => buildApp()).toThrow(/PORT/i);
  });

  it('rejects invalid NODE_ENV', () => {
    process.env.NODE_ENV = 'staging';
    const { buildApp } = reload('../../src/app.js');
    expect(() => buildApp()).toThrow(/NODE_ENV/i);
  });

  it('defaults LOG_LEVEL to "info" when omitted (no throw)', () => {
    delete process.env.LOG_LEVEL;
    const { buildApp } = reload('../../src/app.js');
    expect(() => buildApp()).not.toThrow();
  });
});
