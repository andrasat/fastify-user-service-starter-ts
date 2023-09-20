import fastify, { FastifyServerOptions } from "fastify";
import jwtPlugin from "./plugins/jwt";

import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";

function buildApp(opts?: FastifyServerOptions) {
  const server = fastify(opts);

  server.register(jwtPlugin);

  server.register(authRoutes, { prefix: "/auth" });
  server.register(userRoutes, { prefix: "/user" });
  server.get("/", (_, reply) => reply.send("OK"));
  server.all("*", (_, reply) => reply.status(404).send("Not Found"));

  return server;
}

export default buildApp;
