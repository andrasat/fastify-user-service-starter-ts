import buildApp from "../index";

export function build() {
  const app = buildApp(true);

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app?.close();
  });

  return app;
}
