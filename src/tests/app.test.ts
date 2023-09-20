import buildApp from "../index";

describe("Server Initialization", () => {
  const app = buildApp();

  test("server should be initialized", () => {
    expect(app).toBeDefined();
  });
});
