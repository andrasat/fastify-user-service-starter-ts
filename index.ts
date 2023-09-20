import buildApp from "./src/index";

const app = buildApp({
  logger: {
    level: "info",
    transport: {
      target: "pino-pretty",
    }
  }
});

app.listen({ host: "0.0.0.0", port: 8081 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server listening at ${address}`);
});
