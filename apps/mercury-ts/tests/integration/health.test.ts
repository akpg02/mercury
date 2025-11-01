import { describe, it, expect } from "vitest";
import { buildApp } from "../../src/app";

describe("GET /health (TS CommonJS)", () => {
  it("returns 200 and expected shape", async () => {
    const app = buildApp();
    await app.ready();

    const res = await app.inject({ method: "GET", url: "/health" });
    const body = res.json();

    expect(res.statusCode).toBe(200);
    expect(body).toEqual(
      expect.objectContaining({
        status: "ok",
        version: expect.any(String),
        uptime: expect.any(Number),
      })
    );

    await app.close();
  });
});
