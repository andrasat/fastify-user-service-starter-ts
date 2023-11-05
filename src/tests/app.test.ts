import type { FastifyInstance } from "fastify";
import buildApp from "../index";

describe("Server Initialization", () => {
  let app: FastifyInstance | undefined;

  beforeAll(async () => {
    app = await buildApp(true);
  });

  afterAll(async () => {
    await app?.close();
  });

  test("server should be initialized", () => {
    expect(app).toBeDefined();
  });
});
