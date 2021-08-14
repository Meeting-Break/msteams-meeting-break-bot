import request from "supertest";
import "reflect-metadata";
import { app } from "../../src/app";

describe("healthController", () => {
  it("returns 200", async () => {
    const result = await request(app).get("/api/health").send();
    expect(result.status).toBe(200);
  });
});
