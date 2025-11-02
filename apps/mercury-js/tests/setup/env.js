// A safe baseline env for all tests.
// Individual tests can override keys as needed.
const ORIGINAL_ENV = process.env;

beforeEach(() => {
  process.env = {
    ...ORIGINAL_ENV,
    NODE_ENV: 'test',
    PORT: '3000', // string on purpose; your loader should coerce to number
    LOG_LEVEL: 'info',
    DATABASE_URL: 'postgres://user:pass@localhost:5432/mercury_test',
  };
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
});
