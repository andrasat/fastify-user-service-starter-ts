import buildApp from "./src/index";

const app = buildApp(false, {
  logger: {
    level: "info",
    transport: {
      target: "pino-pretty",
    }
  }
});

await app.ready();
app.swagger();

app.listen({ host: "0.0.0.0", port: 8081 }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
