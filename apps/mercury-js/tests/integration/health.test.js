const { buildApp } = require("../../src/app");

describe("GET /health (JS)", () => {
  it("returns 200 and expected shape", async () => {
    const app = buildApp();
    await app.ready();

    const res = await app.inject({ method: "GET", url: "/health" });

    expect(res.statusCode).toBe(200);
    const body = res.json();
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
