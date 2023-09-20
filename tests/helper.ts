import buildApp from "../src/index";

export function build() {
  const app = buildApp();

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(() => app.close());

  return app;
}
