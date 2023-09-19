import fastify from "fastify";
import jwt from "@fastify/jwt";

import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";

const server = fastify();

server.register(jwt, { secret: process.env.JWT_SECRET! });
server.register(authRoutes, { prefix: "/auth" });
server.register(userRoutes, { prefix: "/user" });
server.get("/", (_, reply) => reply.send("OK"));
server.all("*", (_, reply) => reply.status(404).send("Not Found"));

server.listen({ host: "0.0.0.0", port: 8081 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server listening at ${address}`);
});
