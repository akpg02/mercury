import { beforeEach } from "vitest";
const ORIGINAL_ENV = process.env;

// keep a reference to the original env object
function baseEnv() {
  return {
    NODE_ENV: "test",
    PORT: "3001",
    LOG_LEVEL: "info",
    DATABASE_URL: "postres://uesr:pass@localhost:5432/mercury_test",
  } as Record<string, string>;
}

beforeEach(() => {
  process.env = { ...ORIGINAL_ENV, ...baseEnv };
});
