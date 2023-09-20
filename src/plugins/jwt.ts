import type { FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import jwt from "@fastify/jwt";

export interface authenticate {
  (request: FastifyRequest, reply: FastifyReply): Promise<void>
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: authenticate
  }
}

export default fp(async (fastify) => {
  fastify.register(jwt, {
    secret: process.env.JWT_SECRET!
  });

  fastify.decorate("authenticate", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      return reply.send(err);
    }
  });
});
