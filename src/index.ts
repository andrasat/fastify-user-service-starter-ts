import fastify, { FastifyServerOptions } from "fastify";
import jwt from "@fastify/jwt";

import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";

function buildApp(opts?: FastifyServerOptions) {
  const server = fastify(opts);

  server.register(jwt, { secret: process.env.JWT_SECRET! });
  server.register(authRoutes, { prefix: "/auth" });
  server.register(userRoutes, { prefix: "/user" });
  server.get("/", (_, reply) => reply.send("OK"));
  server.all("*", (_, reply) => reply.status(404).send("Not Found"));

  return server;
}

export default buildApp;
