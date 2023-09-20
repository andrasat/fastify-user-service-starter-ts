import { build, mockRepository } from "./helper";

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

  test("GET /not-found", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/not-found",
    });

    expect(response.statusCode).toBe(404);
    expect(response.payload).toEqual("Not Found");
  });

  test("Route /user is protected", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/user/not-a-valid-id",
      headers: {
        Authorization: "",
      }
    });

    const payload = response.json();
    expect(response.statusCode).toBe(401);
    expect(payload).toHaveProperty("error", "Unauthorized");
    expect(payload).toHaveProperty("message", "missing token");
  });

  test("GET /user/:id", async () => {
    const { userData } = mockRepository();
    const token = app.jwt.sign({ id: userData.id }, { expiresIn: "1h" });

    const response = await app.inject({
      method: "GET",
      url: "/user/00000000-0000-0000-0000-000000000000",
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    console.log(response.payload);

    expect(response.statusCode).toBe(200);
    expect(response.json<typeof userData>()).toHaveProperty("id", userData.id);
    expect(response.json<typeof userData>()).toHaveProperty("email", userData.email);
    expect(response.json<typeof userData>()).toHaveProperty("name", userData.name);
  });
});
