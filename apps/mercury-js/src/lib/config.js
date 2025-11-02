// Goal: Fail fast on invalid env; provide normalized values
const { z } = require('zod');

class ConfigError extends Error {
  constructor(issues) {
    const message = issues
      .map((i) => {
        const path = i.path.join('.') || '(root)';
        return `${path}: ${i.message}`;
      })
      .join('; ');
    super(`Invalid configuration: ${message}`);
    this.name = 'ConfigError';
  }
}

let cached; // simple memoization

const RawEnv = z.object({
  PORT: z.preprocess(
    (v) => (v === '' || v === null ? undefined : v),
    z.coerce.number().min(1).max(65535, { message: 'PORT must be 1-65535' }),
  ),
  NODE_ENV: z.enum(['development', 'test', 'production']),
  DATABASE_URL: z.string().min(1, { message: 'DATABASE_URL is required' }),
  LOG_LEVEL: z.string().default('info'),
});

// Transform raw -> normalize shape the app will use
const EnvSchema = RawEnv.transform(
  ({ PORT, NODE_ENV, DATABASE_URL, LOG_LEVEL }) => ({
    port: PORT,
    nodeEnv: NODE_ENV,
    databaseUrl: DATABASE_URL,
    logLevel: LOG_LEVEL,
  }),
);

function loadConfig() {
  if (cached) return cached;

  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) throw new ConfigError(parsed.error.issues);

  // freeze to prevent accidental mutation
  cached = Object.freeze(parsed.data);
  return cached;
}

module.exports = { EnvSchema, loadConfig, ConfigError };

// Note: z.preprocess treats empty string as missing for PORT
//.      Memoization avoids re-parsing for every request
