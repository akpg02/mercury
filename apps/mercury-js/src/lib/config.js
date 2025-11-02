const { z } = require('zod');

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

module.exports = { EnvSchema };

// Note: z.preprocess treats empty string as missing for PORT
