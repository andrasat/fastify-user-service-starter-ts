import buildApp from "../src/index";

describe("Server Initialization", () => {
  test("server should be initialized", async () => {
    expect(buildApp()).resolves.not.toThrow();
  });
});
