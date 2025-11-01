// src/app.ts
import Fastify, { FastifyInstance } from "fastify";

export function buildApp(): FastifyInstance {
  const app = Fastify({ logger: false });

  app.get("/health", async () => ({
    status: "ok" as const,
    uptime: process.uptime(),
    version: process.env.npm_package_version || "0.0.0",
  }));

  return app;
}
