import { build } from "./helper";

describe("Routes", () => {
  const app = build();

  test("GET /", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/",
    });

    expect(response.statusCode).toBe(200);
    expect(response.payload).toEqual("OK");
  });
});
