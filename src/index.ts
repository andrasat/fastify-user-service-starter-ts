import fastify, { FastifyServerOptions } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import jwtPlugin from "./plugins/jwt";

import authRoutes from "./routes/auth";
import usersRoutes from "./routes/users";

function buildApp(testMode: boolean = false, opts?: FastifyServerOptions,) {
  const server = fastify(opts);

  server.register(jwtPlugin);

  if (!testMode) {
    server.register(swagger, {
      openapi: {
        info: {
          title: "Fastify User Service Starter",
          description: "API Documentation",
          version: "0.1.0",
        },
        servers: [{
          url: "http://localhost:8081",
        }],
        components: {
          securitySchemes: {
            jwt: {
              type: "http",
              bearerFormat: "JWT",
              scheme: "bearer",
            },
          },
        },
      },
    });

    server.register(swaggerUI, {
      routePrefix: "/docs",
      uiConfig: {
        docExpansion: "full",
        deepLinking: false,
      }
    });
  }

  server.register(authRoutes, { prefix: "/auth" });
  server.register(usersRoutes, { prefix: "/users" });
  server.get("/", (_, reply) => reply.send("OK"));
  server.all("*", (_, reply) => reply.status(404).send("Not Found"));

  return server;
}

export default buildApp;
