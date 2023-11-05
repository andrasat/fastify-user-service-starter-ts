import { FastifyInstance } from "fastify";
import buildApp from "../index";

describe("Routes", () => {
  let app: FastifyInstance | undefined;

  beforeAll(async () => {
    app = await buildApp(true);
    await app?.ready();
  });

  afterAll(async () => {
    await app?.close();
  });

  test("GET /", async () => {
    const response = await app?.inject({
      method: "GET",
      url: "/",
    });

    expect(response?.statusCode).toBe(200);
    expect(response?.payload).toEqual("OK");
  });

  test("GET /not-found", async () => {
    const response = await app?.inject({
      method: "GET",
      url: "/not-found",
    });

    expect(response?.statusCode).toBe(404);
    expect(response?.payload).toEqual("Not Found");
  });

  test("Route /users is protected", async () => {
    const response = await app?.inject({
      method: "GET",
      url: "/users/not-a-valid-id",
      headers: {
        Authorization: "",
      }
    });

    const payload = response?.json();
    expect(response?.statusCode).toBe(401);
    expect(payload).toHaveProperty("message", "missing token");
  });
});
