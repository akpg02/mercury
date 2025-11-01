// src/server.ts
import { buildApp } from "./app";

const port = Number(process.env.PORT || 3001);
const host = "0.0.0.0";
const app = buildApp();

app.listen({ port, host }, (err: Error | null, address?: string) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`mercury-ts (CommonJS) running at ${address}`);
});
